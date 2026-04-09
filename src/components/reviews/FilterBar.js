"use client";

export default function FilterBar({ activeFilter, onFilterChange, counts }) {
  const filters = [
    { key: "all", label: "All Reviews", count: counts.total },
    { key: "positive", label: "Positive", count: counts.positive },
    { key: "neutral", label: "Neutral", count: counts.neutral },
    { key: "negative", label: "Negative", count: counts.negative },
  ];

  const dotColors = {
    all: "bg-brand-500",
    positive: "bg-positive-500",
    neutral: "bg-neutral_tone-500",
    negative: "bg-negative-500",
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
            ${
              activeFilter === filter.key
                ? "bg-white text-surface-900 shadow-card border border-surface-100"
                : "text-surface-500 hover:bg-white/60 hover:text-surface-700"
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${dotColors[filter.key]}`} />
          {filter.label}
          <span
            className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
              activeFilter === filter.key
                ? "bg-brand-50 text-brand-600"
                : "bg-surface-100 text-surface-500"
            }`}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}
