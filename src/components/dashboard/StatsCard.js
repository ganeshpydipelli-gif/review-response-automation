"use client";

export default function StatsCard({ icon, label, value, trend, color = "brand", delay = 0 }) {
  const colorStyles = {
    brand: { bg: "bg-brand-50", icon: "text-brand-500", trend: "text-brand-600" },
    positive: { bg: "bg-positive-50", icon: "text-positive-500", trend: "text-positive-600" },
    neutral: { bg: "bg-neutral_tone-50", icon: "text-neutral_tone-500", trend: "text-neutral_tone-600" },
    negative: { bg: "bg-negative-50", icon: "text-negative-500", trend: "text-negative-600" },
    purple: { bg: "bg-purple-50", icon: "text-purple-500", trend: "text-purple-600" },
  };

  const style = colorStyles[color] || colorStyles.brand;

  return (
    <div
      className="card p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-1 ${style.trend}`}>{trend}</p>
          )}
        </div>
        <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center`}>
          <span className={style.icon}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
