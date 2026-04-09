"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ReviewProvider, useReviews } from "@/context/ReviewContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { getLearningInsights } from "@/lib/data/store";

function SettingsContent() {
  const { user, updateProfile } = useAuth();
  const { editHistory } = useReviews();
  const [form, setForm] = useState({
    businessName: user?.businessName || "",
    businessCategory: user?.businessCategory || "Restaurant",
    preferredTone: user?.preferredTone || "Professional",
  });
  const [saved, setSaved] = useState(false);

  const insights = getLearningInsights();

  const categories = ["Restaurant", "Cafe", "Salon", "Clinic", "Hotel", "Retail Store", "Gym", "Spa", "Other"];
  const tones = [
    { value: "Professional", desc: "Formal and courteous", emoji: "💼" },
    { value: "Friendly", desc: "Warm and approachable", emoji: "😊" },
    { value: "Apologetic", desc: "Empathetic and sincere", emoji: "🤝" },
    { value: "Promotional", desc: "Engaging with offers", emoji: "🎯" },
  ];

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <Header title="Settings" subtitle="Manage your business profile and preferences" />
      <div className="p-6 max-w-3xl space-y-6">
        {/* Success Banner */}
        {saved && (
          <div className="bg-positive-50 text-positive-700 text-sm px-4 py-3 rounded-xl border border-positive-200 animate-scale-in flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings saved successfully!
          </div>
        )}

        {/* Business Profile */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-1">Business Profile</h2>
          <p className="text-xs text-surface-500 mb-5">This information helps AI generate better responses</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="input-field"
                placeholder="The Golden Fork"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Business Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, businessCategory: cat })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.businessCategory === cat
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
                    onClick={() => setForm({ ...form, preferredTone: tone.value })}
                    className={`px-4 py-3 rounded-xl text-left border transition-all ${
                      form.preferredTone === tone.value
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

            <button onClick={handleSave} className="btn-primary">
              Save Settings
            </button>
          </div>
        </div>

        {/* Smart Learning Engine */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900">Smart Learning Engine</h2>
              <p className="text-xs text-surface-500">AI learns from your edits to improve future responses</p>
            </div>
          </div>

          <div className="bg-surface-50 rounded-xl p-4 border border-surface-100 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-surface-900">{insights.totalEdits}</p>
                <p className="text-xs text-surface-500">Total Edits Tracked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {insights.preferredLength === "longer" ? "↑ Longer" : insights.preferredLength === "shorter" ? "↓ Shorter" : "—"}
                </p>
                <p className="text-xs text-surface-500">Length Preference</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-600">
                  {insights.totalEdits > 3 ? "Active" : "Learning"}
                </p>
                <p className="text-xs text-surface-500">Engine Status</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-50/50 rounded-xl p-4 border border-brand-100">
            <p className="text-sm text-brand-700 font-medium mb-1">Learning Summary</p>
            <p className="text-xs text-brand-600/80 leading-relaxed">{insights.summary}</p>
          </div>

          {/* Edit History */}
          {editHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-surface-700 mb-3">Recent Edit History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {editHistory.slice(-5).reverse().map((edit) => (
                  <div key={edit.id} className="bg-surface-50 rounded-xl p-3 border border-surface-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-surface-700">Review: {edit.reviewId}</span>
                      <span className="text-surface-400">{new Date(edit.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-surface-500 line-clamp-2">
                      <span className="text-negative-500 line-through">{edit.originalText?.slice(0, 60)}...</span>
                    </p>
                    <p className="text-positive-600 mt-1">{edit.editedText?.slice(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-1">Account</h2>
          <p className="text-xs text-surface-500 mb-4">Your account information</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-surface-100">
              <span className="text-sm text-surface-600">Email</span>
              <span className="text-sm font-medium text-surface-800">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-surface-100">
              <span className="text-sm text-surface-600">Member since</span>
              <span className="text-sm font-medium text-surface-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <SettingsContent />
      </ReviewProvider>
    </AuthProvider>
  );
}
