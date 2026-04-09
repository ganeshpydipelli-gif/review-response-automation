"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-surface-100 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left: Title */}
      <div>
        <h1 className="text-lg font-bold text-surface-900">{title}</h1>
        {subtitle && <p className="text-xs text-surface-500">{subtitle}</p>}
      </div>

      {/* Right: Search + Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 w-64 rounded-xl bg-surface-50 border border-surface-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
            />
          </div>
        </div>

        {/* Notification */}
        <button className="relative w-9 h-9 rounded-xl bg-surface-50 border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-100 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-negative-500 rounded-full flex items-center justify-center">
            <span className="text-[9px] text-white font-bold">3</span>
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-50 transition-all"
          >
            <Avatar name={user?.businessName || user?.email || "User"} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-surface-800 leading-tight">
                {user?.businessName || "My Business"}
              </p>
              <p className="text-[11px] text-surface-400">{user?.email || ""}</p>
            </div>
            <svg className={`w-4 h-4 text-surface-400 transition-transform ${showProfile ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-100 py-2 animate-scale-in">
              <div className="px-4 py-2 border-b border-surface-100">
                <p className="text-sm font-medium text-surface-800">{user?.businessName}</p>
                <p className="text-xs text-surface-400">{user?.email}</p>
              </div>
              <button
                onClick={() => { setShowProfile(false); router.push("/settings"); }}
                className="w-full px-4 py-2.5 text-left text-sm text-surface-600 hover:bg-surface-50 flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm text-negative-600 hover:bg-negative-50 flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
