"use client";
import { CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {  useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

// import "@/app/globals.css";
export default function Login() {
  const [formError, setFormError] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {pending} = useFormStatus()

  
  async function handleLogin(data: FormData) {
    try {
      const callbackUrl = searchParams.get("callbackUrl") || '/dashboard';
      const res = await signIn("credentials", {
        email: data.get("email"),
        password: data.get("password"),
        redirect: false,
      }, { loginDevice: "mobile" });
      if (res?.ok) {
        setFormError("");
        console.log("Login successful");
        console.log(callbackUrl)
        router.push(callbackUrl);
      } else {
        console.log("Login failed");
        setFormError(res?.error || "Unexpected Error");
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
      <form className="flex w-full min-w-80 flex-col gap-1 rounded-lg bg-white p-8 shadow sm:w-2/3 lg:w-1/4" action={handleLogin}>
        <h1 className="self-center text-xl font-medium">Login</h1>

        <label htmlFor="email">Email</label>
        <input className="rounded-md border border-blue-100 bg-slate-50 px-2 py-1" type="text" name="email" autoFocus required placeholder="john.doe@example.com" autoComplete="username" />

        <label className="mt-2" htmlFor="password">
          Password
        </label>
        <input className="rounded-md border border-blue-100 bg-slate-50 px-2 py-1" type="password" name="password" autoComplete="current-password" />

        <button className="m-4 w-1/2 cursor-pointer self-center rounded-md bg-blue-700 px-4 py-2 text-center font-medium text-white hover:bg-blue-800" type="submit" aria-disabled={pending} >
          {pending? <CircularProgress/> : "Login"}
        </button>
        <p className="form-error text-center text-xs text-red-600">{formError}</p>
        <p className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-700">
            Signup
          </Link>
        </p>
      </form>
      {/* <form className="flex w-full min-w-80 flex-col gap-1 rounded-lg bg-white p-8 shadow sm:w-2/3 lg:w-1/4" action={`${backendURL}/login?redirect=${frontendURL}/dashboard`} method="post"> */}
    </main>
  );
}
