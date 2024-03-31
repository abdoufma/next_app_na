"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ path, text, className }: React.PropsWithChildren<{ path: string; text: string; className?: string }>) {
  const currentPath = usePathname();
  // console.log(currentPath);
  return (
    <Link href={path} className={`nav-item ${path === currentPath ? "text-blue-600 underline" : ""} ${className ?? ""}`}>
      {text}
    </Link>
  );
}
