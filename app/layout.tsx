import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers/query-provider";
import { NextAuthSessionProvider } from "./providers/session-provider";
import { ProjectProvider } from "./providers/project-provider";
import { ToastProvider } from "./components/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reev",
  description: "Lightweight UX insights dashboard",
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
      </body>
    </html>
  );
}
