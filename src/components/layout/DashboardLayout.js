"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Sidebar from "./Sidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center gradient-mesh">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="text-sm text-surface-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface-50 gradient-mesh">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
