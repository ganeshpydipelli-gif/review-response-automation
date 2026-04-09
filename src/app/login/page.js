"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex gradient-mesh">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full filter blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/30 mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">ReviewAI</h1>
          <p className="text-surface-400 text-sm leading-relaxed mb-8">
            Smart review response automation powered by AI. Save hours every week by generating human-like, context-aware responses to customer reviews.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: "500+", l: "Businesses" },
              { n: "50K+", l: "Responses" },
              { n: "98%", l: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.l} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-xl font-bold text-white">{stat.n}</p>
                <p className="text-[11px] text-surface-400">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-surface-900">ReviewAI</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome back</h2>
          <p className="text-sm text-surface-500 mb-8">Sign in to manage your review responses</p>

          {error && (
            <div className="bg-negative-50 text-negative-700 text-sm px-4 py-3 rounded-xl border border-negative-200 mb-6 animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@business.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
