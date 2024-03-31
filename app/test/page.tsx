'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";

function sessionExpired(exp : string){
  return (new Date(exp)).getTime() - Date.now() < 0;
}

export default function TestPage() {
  const session = useSession();
  console.log(session.status);
  if (session.status === "unauthenticated") 
    return <p><Link href="/login" className="text-blue-500 underline">Login</Link> first, bro!</p>
  if (!session.data) return <p>Invalid JWT, bro!</p>
  console.log("[TEST] session data:", session.data);
  if (sessionExpired(session.data.expires)) return <p>Expired session, bro!</p>;
  const {user} = session!.data;

  return  <>
            <h2>Valid token!</h2>
            <h2>Welcome, {user?.email}</h2>
          </>
}

