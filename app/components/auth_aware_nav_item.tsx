"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { User } from "@/lib/types";

export default function AuthAwareNavItem({ className }: React.PropsWithChildren<{ className?: string }>) {
  const session = useSession();
  if (session.status === "loading") return <CircularProgress />;
  if (session.status === "unauthenticated") return <NavItemUnauthenticated className={className} />;
  if (session.status === "authenticated" && session.data?.user ) return <NavItemAuthenticated user={session.data.user} className={className}/>;
  return <h2>Idk, man!</h2>
}


function NavItemAuthenticated ({user, className} : React.PropsWithChildren<{user: User, className?: string}>) {
  return <h2 className={`nav-item ${className ?? ""}`}>Welcome, {user.name}</h2>;
}

function NavItemUnauthenticated ({className} : React.PropsWithChildren<{className?: string}>) {
  return <Link href="/login" className={`nav-item ${className ?? ""}`}>Login</Link>;
}