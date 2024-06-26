import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/utils/session_provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {title: { default: 'Next Auth', template: '%s | Next Auth' }, description: "Generated by create next app" };

import NavItem from "./components/nav_item";
import AuthAwareNavItem from "./components/auth_aware_nav_item";

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const session = await getServerSession(authOptions);
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <nav className="flex gap-2 bg-white p-2 shadow-md">
            <NavItem path="/" text="Home" />
            {/* <NavItem path="/login" text="Login" /> */}
            <NavItem path="/dashboard" text="dashboard" />
            <NavItem path="/test" text="test" />
            <NavItem path="/playground" text="playground" />
            {/* <NavItem path={`${backendURL}/login`} text="Login (Express)" className="ml-auto"/> */}
            <AuthAwareNavItem className="ml-auto"/>
          </nav>
          {/* <main className="flex min-h-screen min-w-full flex-col items-center justify-center bg-slate-100 p-10"> */}
          {children}
          {/* </main> */}
        </body>
      </html>
    </SessionProvider>
  );
}
