import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { subscribe } from "@/lib/actions/subscribe";
import { createReferral } from "@/lib/actions/createReferral";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const referral = searchParams.get("referral");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  const newsletter = searchParams.get("newsletter") === "true";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !session) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    if (referral) {
      const { user } = session;
      await createReferral({ supabase, userId: user.id, referral });
    }

    if (newsletter) {
      const { user } = session;
      if (user.email) await subscribe(user.email);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}${next}`);
}
