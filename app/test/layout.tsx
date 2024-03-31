import { Metadata } from "next";

export const metadata : Metadata = {title: "Testing Page",};

export default async function TestLayout({ children }: React.PropsWithChildren) {
 
  return (
      <main className="flex min-h-screen min-w-full flex-col items-center justify-center text-xl font-bold">
           {children}
      </main>
  );
}
