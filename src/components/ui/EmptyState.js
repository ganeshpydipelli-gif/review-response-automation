"use client";

export default function EmptyState({ icon, title, description, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
          <span className="text-brand-400">{icon}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-800 mb-2">{title}</h3>
      <p className="text-sm text-surface-500 text-center max-w-sm mb-6">{description}</p>
      {action && action}
    </div>
  );
}
