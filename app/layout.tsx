import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import Client from "./Client";
import "./globals.css";

export const metadata: Metadata = {
  title: "XO Arena - Play Tic-Tac-Toe Online with Anyone",
  description: "XO Arena is the ultimate online Tic-Tac-Toe game. Challenge random opponents, track your wins, and climb the leaderboard!",
  keywords: ["XO Arena", "Tic-Tac-Toe online", "Play X and O", "Online multiplayer game"],
  authors: [{ name: "Shoxruh", url: "https://mlns.site" }],
  manifest: `/manifest.json`,
  openGraph: {
    title: "XO Arena - Online Tic-Tac-Toe Game",
    description: "Play XO Arena online against random opponents. Track wins and compete on the leaderboard!",
    url: "https://mlns.site",
    siteName: "XO Arena",
    images: [
      {
        url: "https://mlns.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "XO Arena Online Tic-Tac-Toe",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  interactiveWidget: 'resizes-content' as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "XO Arena",
              "url": "https://mlns.site",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://mlns.site/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Game",
              "name": "XO Arena",
              "url": "https://mlns.site",
              "description": "Play XO Arena online against random opponents. Track your wins and climb the leaderboard.",
              "image": "https://mlns.site/og-image.png",
              "gamePlatform": "Web",
              "author": { "@type": "Organization", "name": "XO Arena" }
            })
          }}
        />
      </head>
      <body className={`antialiased h-dvh`}>
        <Client>{children}</Client>
        <Analytics />
      </body>
    </html>
  );
}
