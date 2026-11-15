"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Onboarding from "@/components/Onboarding";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isLandingPage && <Onboarding />}
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] pt-16">{children}</main>
    </>
  );
}
