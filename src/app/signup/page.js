"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    businessName: "",
    businessCategory: "Restaurant",
    preferredTone: "Professional",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const categories = ["Restaurant", "Cafe", "Salon", "Clinic", "Hotel", "Retail Store", "Gym", "Spa", "Other"];
  const tones = [
    { value: "Professional", desc: "Formal and courteous", emoji: "💼" },
    { value: "Friendly", desc: "Warm and approachable", emoji: "😊" },
    { value: "Apologetic", desc: "Empathetic and sincere", emoji: "🤝" },
    { value: "Promotional", desc: "Engaging with offers", emoji: "🎯" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signup(form);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen flex gradient-mesh">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-500 rounded-full filter blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/30 mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Join ReviewAI</h1>
          <p className="text-surface-400 text-sm leading-relaxed mb-8">
            Set up your account in under 2 minutes. Start generating smart, personalized responses to your customer reviews today.
          </p>
          <div className="space-y-4 text-left">
            {["AI-powered response generation", "Smart learning from your edits", "One-click publish simulation", "Sentiment analytics dashboard"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-surface-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-surface-900">ReviewAI</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Create your account</h2>
          <p className="text-sm text-surface-500 mb-6">Step {step} of 2 — {step === 1 ? "Account details" : "Business profile"}</p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "gradient-brand" : "bg-surface-200"} transition-all`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "gradient-brand" : "bg-surface-200"} transition-all`} />
          </div>

          {error && (
            <div className="bg-negative-50 text-negative-700 text-sm px-4 py-3 rounded-xl border border-negative-200 mb-6 animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className="input-field" placeholder="you@business.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} className="input-field" placeholder="••••••••" required minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Business Name</label>
                  <input type="text" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} className="input-field" placeholder="The Golden Fork" required />
                </div>
                <button
                  type="button"
                  onClick={() => { if (form.email && form.password && form.businessName) setStep(2); }}
                  className="btn-primary w-full py-3 text-sm mt-2"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Business Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateForm("businessCategory", cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${form.businessCategory === cat
                          ? "bg-brand-50 text-brand-700 border-brand-200 shadow-sm"
                          : "bg-white text-surface-500 border-surface-200 hover:border-surface-300"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Preferred Response Tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {tones.map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => updateForm("preferredTone", tone.value)}
                        className={`px-4 py-3 rounded-xl text-left border transition-all ${form.preferredTone === tone.value
                          ? "bg-brand-50 border-brand-200 shadow-sm"
                          : "bg-white border-surface-200 hover:border-surface-300"
                          }`}
                      >
                        <span className="text-lg">{tone.emoji}</span>
                        <p className={`text-sm font-medium mt-1 ${form.preferredTone === tone.value ? "text-brand-700" : "text-surface-700"}`}>
                          {tone.value}
                        </p>
                        <p className="text-[11px] text-surface-400">{tone.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 text-sm">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-sm disabled:opacity-60">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}
