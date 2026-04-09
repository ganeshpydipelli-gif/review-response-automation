"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    // Start exit animation before removing
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
    }, duration - 400);

    // Remove after exit animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none lg:bottom-6 lg:right-6 max-sm:bottom-20 max-sm:right-4 max-sm:left-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }) {
  const typeStyles = {
    success: {
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      icon: (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
    },
    info: {
      bg: "bg-gradient-to-r from-brand-500 to-brand-600",
      icon: (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500 to-amber-600",
      icon: (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      ),
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      icon: (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
    },
  };

  const style = typeStyles[toast.type] || typeStyles.success;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white min-w-[320px] max-w-[420px]
        ${style.bg}
        ${toast.exiting ? "animate-toast-exit" : "animate-toast-enter"}
      `}
    >
      {style.icon}
      <div className="flex-1">
        <p className="text-sm font-semibold leading-snug">{toast.message}</p>
      </div>
      {/* Animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden bg-black/10">
        <div
          className="h-full bg-white/30 rounded-b-2xl animate-toast-progress"
        />
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
