"use client";

export default function Avatar({ name, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const colors = [
    "from-brand-400 to-brand-600",
    "from-purple-400 to-purple-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-600",
    "from-rose-400 to-rose-600",
    "from-cyan-400 to-cyan-600",
    "from-indigo-400 to-indigo-600",
    "from-pink-400 to-pink-600",
  ];

  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorIndex =
    (name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} 
        flex items-center justify-center text-white font-semibold shadow-sm
        ring-2 ring-white ${className}`}
    >
      {initials}
    </div>
  );
}
