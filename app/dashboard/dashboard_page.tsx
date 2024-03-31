"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function DashboardPage() {
  // return <h2>Welcome to your Dashboard!</h2>;
  const session = useSession();
  const [serverData, setServerData] = useState<string>();
  const [error, setError] = useState<string>("");
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const sendRequest = async (path: string) => {
    try {
      const res = await fetch(`${backendURL}${path}`, { credentials: "include" });
      if (res.status !== 200) setError(`Error : (HTTP code ${res.status})`);
      const data = await res.text();
      setServerData(data);
    } catch (err) {
      setError(`Unexpected Error : ${err}`);
    }
  };
  return (
    <main className="p4 m-auto flex h-screen w-screen cursor-pointer flex-col items-center justify-center gap-2 border">
      <h2 className="text-2xl mb-6 font-medium" >Welcome to your Dashboard, {session?.data?.user?.name ?? "Hacker 😡"}!</h2>
      <div className="flex gap-5">
        <button className="btn rounded-lg bg-orange-700 px-4 py-2 font-medium text-white" onClick={() => sendRequest("/admin/protected")}>Admin resource</button>
        <button className="btn rounded-lg bg-blue-500 px-4 py-2 font-medium text-white" onClick={() => sendRequest("/user/protected")}>User resource</button>
      </div>
      <p className="error text-red-500">{error}</p>
      <b className="rounded-lg border border-dashed border-blue-900 bg-blue-400 p-6 text-center">
        <p>Server response:</p>
        <p>{serverData ?? "Click one of the buttons above to test the api."}</p>
      </b>
      <button className="btn px-4 py-2 rounded text-white bg-red-500 font-medium m-4" onClick={() =>signOut({redirect: true, callbackUrl : "/login"})}>Logout</button>
    </main>
  );
}
