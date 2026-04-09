"use client";

import { useState, useMemo } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ReviewProvider, useReviews } from "@/context/ReviewContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import ReviewCard from "@/components/reviews/ReviewCard";
import FilterBar from "@/components/reviews/FilterBar";
import EmptyState from "@/components/ui/EmptyState";

function ReviewsContent() {
  const { reviews, stats, generateAll, generatingFor } = useReviews();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Apply sentiment filter
    if (filter !== "all") {
      filtered = filtered.filter((r) => r.sentiment === filter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.reviewerName.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q)
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  }, [reviews, filter, searchQuery]);

  const counts = {
    total: stats.total,
    positive: stats.positive,
    neutral: stats.neutral,
    negative: stats.negative,
  };

  return (
    <DashboardLayout>
      <Header title="Reviews" subtitle={`${stats.total} total reviews · ${stats.responseRate}% response rate`} />
      <div className="p-6 space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <FilterBar activeFilter={filter} onFilterChange={setFilter} counts={counts} />
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 w-48 rounded-xl bg-white border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
              />
            </div>
            <button
              onClick={generateAll}
              disabled={!!generatingFor}
              className="btn-primary text-sm disabled:opacity-60"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">Generate All</span>
              </span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review, i) => (
              <div key={review.id} style={{ animationDelay: `${i * 50}ms` }}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title={searchQuery ? "No matching reviews" : "No reviews in this category"}
            description={searchQuery ? `No reviews match "${searchQuery}". Try a different search term.` : "Reviews will appear here once customers leave feedback."}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ReviewsPage() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <ReviewsContent />
      </ReviewProvider>
    </AuthProvider>
  );
}
