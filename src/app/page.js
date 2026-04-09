"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = typeof window !== "undefined"
      ? localStorage.getItem("rra_current_user")
      : null;
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center gradient-mesh">
      <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}
