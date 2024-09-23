import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { subscribe } from "@/lib/actions/subscribe";
import { createReferral } from "@/lib/actions/createReferral";
import { redirect } from "next/navigation";

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
      console.log("wtf is happening 4143");
      return redirect(`${origin}/auth/auth-code-error`);
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

  // return the user to an error page with instructions
  const nextSearchParams = new URLSearchParams({ code: origin, next });
  console.log("wtf is happening");
  return redirect(
    `${process.env.NEXT_PUBLIC_URL}/auth/redirect/?${searchParams.toString()}`
  );
}
