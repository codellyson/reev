import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers/query-provider";
import { NextAuthSessionProvider } from "./providers/session-provider";
import { ProjectProvider } from "./providers/project-provider";
import { ToastProvider } from "./components/ui";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reev – Open-Source UX Feedback Tracker",
    template: "%s | Reev",
  },
  description:
    "Detect rage clicks, dead links, broken images, and form frustration. Collect real user feedback with zero setup. Self-hosted and open source.",
  keywords: [
    "UX feedback",
    "rage click detection",
    "user experience",
    "frustration tracking",
    "dead link checker",
    "broken image detection",
    "form frustration",
    "self-hosted analytics",
    "open source",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://reev.dev"
  ),
  openGraph: {
    type: "website",
    siteName: "Reev",
    title: "Reev – Open-Source UX Feedback Tracker",
    description:
      "Detect rage clicks, dead links, broken images, and form frustration. Collect real user feedback with zero setup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reev – Open-Source UX Feedback Tracker",
    description:
      "Detect rage clicks, dead links, broken images, and form frustration. Collect real user feedback with zero setup.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-zinc-950 text-zinc-100">
        <NextAuthSessionProvider>
          <QueryProvider>
            <ProjectProvider>
              <ToastProvider>{children}</ToastProvider>
            </ProjectProvider>
          </QueryProvider>
        </NextAuthSessionProvider>
           {/* Load the actual tracker on this page */}
      <Script
        id="reev-loader"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `!function(c,s){window.ReevConfig=c;s=document.createElement("script");s.src="/reev.js";document.head.appendChild(s)}({projectId:"854799fc-a118-4432-9f81-108518f3e82e",apiUrl:window.location.origin,popover:true,popoverTheme:"light",suggestions:true,demoSuggestions:[{url:"#demo",label:"Try the Live Demo"},{url:"/signup",label:"Create an Account"},{url:"#how-it-works",label:"See How It Works"}]});`,
        }}
      />
      </body>
    </html>
  );
}
