"use client";

import { getSentimentColor } from "@/lib/data/sampleReviews";

export default function SentimentBadge({ sentiment, size = "md" }) {
  const colors = getSentimentColor(sentiment);
  const labels = { positive: "Positive", neutral: "Neutral", negative: "Negative" };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} 
        ${colors.bg} ${colors.text} ${colors.border} border rounded-full font-medium`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {labels[sentiment] || sentiment}
    </span>
  );
}
