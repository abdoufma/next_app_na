"use client";
import { CircularProgress } from "@mui/material";
import Switch from "@mui/material/Switch";
import { signIn,  } from "next-auth/react";
import Link from "next/link";
import {  useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

// import "@/app/globals.css";
export default function Signup() {
  const [formError, setFormError] = useState<string | undefined>();
  const [role, setRole] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {pending} = useFormStatus()

  
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const callbackUrl = searchParams.get("callbackUrl") || '/dashboard';
  
  async function handleSingup(data: FormData) {
    console.log(`Sending signup request to ${backendURL}/signup`);
    try {
      const res = await fetch(`${backendURL}/signup`, {
        method: 'POST',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          role : data.get('role') ? 'admin' : 'user',
        })
      });
      console.log('Request done');
      if (res?.ok) {
        setFormError("");
        console.log("Signup successful");
        // console.log(callbackUrl)
        router.push(callbackUrl);
      } else {
        console.log("Signup failed");
        const {error} = await res?.json();
        setFormError( error || "Unexpected Error");
      }

      //   console.log(await res.text());
    } catch (err) {
      console.error(err);
      setFormError(JSON.stringify(err));
    }
    //
  }
  return (
    <main className="flex min-h-screen min-w-full flex-col items-center justify-center bg-slate-100 p-10">
      <form className="flex w-full min-w-80 flex-col gap-1 rounded-lg bg-white p-8 shadow sm:w-2/3 lg:w-1/4" action={handleSingup}>
        <h1 className="self-center text-xl font-medium">Signup</h1>

        <label htmlFor="email">Name</label>
        <input className="rounded-md border border-blue-100 bg-slate-50 px-2 py-1" type="text" name="name" autoFocus required placeholder="Hamid" autoComplete="name" />

        <label htmlFor="email">Email</label>
        <input className="rounded-md border border-blue-100 bg-slate-50 px-2 py-1" type="text" name="email" autoFocus required placeholder="john.doe@example.com" autoComplete="username" />

        <label className="mt-2" htmlFor="password">
          Password
        </label>
        <input className="rounded-md border border-blue-100 bg-slate-50 px-2 py-1" type="password" name="password" autoComplete="new-password" />

        <label className="mt-2" htmlFor="password">
          Confirm Password
        </label>
        <input className="rounded-md border border-blue-100 bg-slate-50 px-2 py-1" type="password" name="password" autoComplete="new-password" />

        <label className="mt-2" htmlFor="role">
          Admin?
        </label>
        
        <input className="" hidden type="checkbox" name="role" checked={role} onChange={() => {}} />
        <Switch onChange={(e, checked) => setRole(checked)}/>

        <button className="m-4 w-1/2 cursor-pointer self-center rounded-md bg-blue-700 px-4 py-2 text-center font-medium text-white hover:bg-blue-800" type="submit" aria-disabled={pending} >
          {pending? <CircularProgress/> : "Signup"}
        </button>
        <p className="form-error text-center text-xs text-red-600">{formError}</p>
        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
