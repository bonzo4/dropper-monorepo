import type { Metadata } from "next";
import "./globals.css";
import { dropper } from "@repo/ui/utils";
import { cn } from "@repo/ui/utils";
import Header from "@/components/header/Header";
import { createSupabaseServer } from "@repo/lib/supabase";
import { DropmanView } from "@/lib/types/user";
import Login from "./login/page";
import { UserCodeRow } from "@/lib/types/accessCode";
import Code from "./code/page";
import { getTickers, TickerGiveaway } from "@/lib/data/getTickers";
import { cache } from "react";
import { headers } from "next/headers";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Dropper",
  metadataBase: new URL("https://dropper.wtf"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dropper",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "Dropper",
  appleWebApp: {
    title: "Dropper",
    statusBarStyle: "default",
    capable: true,
  },
  // verification: {
  //   google: process.env.GOOGLE_SEO_KEY,
  // },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/apple-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/apple-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/apple-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/apple-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/apple-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/apple-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = headers().get("x-next-pathname") as string;
  if (pathname === "/auth/redirect") {
    return (
      <LayoutWrapper profile={null} tickers={[]}>
        {children}
      </LayoutWrapper>
    );
  }

  const supabase = await createSupabaseServer();
  const userData = cache(() => supabase.auth.getUser())();
  const tickersData = getTickers({ supabase });

  const [
    {
      data: { user },
    },
    tickers,
  ] = await Promise.all([userData, tickersData]);

  let profile: DropmanView | null = null;
  let accessCode: UserCodeRow | null = null;

  if (user) {
    const profilePromise = supabase
      .from("dropmans_view")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const codePromise = supabase
      .from("user_codes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const [{ data: profileData }, { data: accessCodeData }] = await Promise.all(
      [await profilePromise, await codePromise]
    );

    profile = profileData;
    accessCode = accessCodeData;
  }

  if (!profile) {
    return (
      <LayoutWrapper profile={profile} tickers={tickers}>
        <Login />
      </LayoutWrapper>
    );
  }

  if (!accessCode) {
    return (
      <LayoutWrapper profile={profile} tickers={tickers}>
        <Code />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper profile={profile} tickers={tickers}>
      {children}
    </LayoutWrapper>
  );
}

function LayoutWrapper({
  profile,
  children,
  tickers,
}: {
  profile: DropmanView | null;
  children: React.ReactNode;
  tickers: TickerGiveaway[];
}) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-2LSDNY7P0K" />
      <body
        className={cn(
          "relative flex flex-col min-h-screen w-full",
          dropper.className
        )}
      >
        <Header tickers={tickers} profile={profile} />
        {children}
      </body>
    </html>
  );
}
