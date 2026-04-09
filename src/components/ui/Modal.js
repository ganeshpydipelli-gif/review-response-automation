"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`relative ${maxWidth} w-full bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden`}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
