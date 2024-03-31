import DashboardPage from "./dashboard_page";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PropsWithChildren } from "react";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Checking session (serverside)", session);
    if (!session) return <ErrorMessage message="Get tf out! 🛑" />;//return redirect("/login"); //
    if (!session.user) return <ErrorMessage message="Who tf are you?! 🤨" />
    const user = session.user;
    if (user) return <DashboardPage />;
    return <h2>You are not authorized to view this page, homie 💀</h2>;
  } catch (err: unknown) {
    console.error(err);
    return ErrorMessage(err as Error);
  }
}

function ErrorMessage({children, message} : PropsWithChildren<{message? : string}>) {
  return <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
          {message ? <h2>{message}</h2> : children}
         </div> 
}