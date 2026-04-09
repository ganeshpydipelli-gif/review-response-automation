"use client";

export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
    </div>
  );
}
