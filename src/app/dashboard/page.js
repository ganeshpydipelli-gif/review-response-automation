"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReviewProvider, useReviews } from "@/context/ReviewContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import ReviewCard from "@/components/reviews/ReviewCard";
import Link from "next/link";

function DashboardContent() {
  const { reviews, stats, generateAll, generatingFor } = useReviews();
  const recentReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <DashboardLayout>
      <Header title="Dashboard" subtitle="Overview of your review management" />
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Reviews"
            value={stats.total}
            trend={`${stats.avgRating} avg rating`}
            color="brand"
            delay={0}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
          <StatsCard
            label="Response Rate"
            value={`${stats.responseRate}%`}
            trend={`${stats.responded} responded`}
            color="positive"
            delay={100}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Published"
            value={stats.published}
            trend={`${stats.approved} approved`}
            color="purple"
            delay={200}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            }
          />
          <StatsCard
            label="Pending"
            value={stats.pending}
            trend={`${stats.negative} negative reviews`}
            color="negative"
            delay={300}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-surface-900">Quick Actions</h2>
              <p className="text-xs text-surface-500 mt-0.5">Generate responses for all unreplied reviews at once</p>
            </div>
            <button
              onClick={generateAll}
              disabled={!!generatingFor}
              className="btn-primary disabled:opacity-60"
            >
              <span className="flex items-center gap-2">
                {generatingFor ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate All Responses
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Sentiment Summary Bar */}
          <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-surface-100">
            {stats.total > 0 && (
              <>
                <div className="h-full bg-positive-400 rounded-l-full transition-all duration-500" style={{ width: `${(stats.positive / stats.total) * 100}%` }} />
                <div className="h-full bg-neutral_tone-400 transition-all duration-500" style={{ width: `${(stats.neutral / stats.total) * 100}%` }} />
                <div className="h-full bg-negative-400 rounded-r-full transition-all duration-500" style={{ width: `${(stats.negative / stats.total) * 100}%` }} />
              </>
            )}
          </div>
          <div className="flex items-center gap-6 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-surface-500">
              <span className="w-2 h-2 rounded-full bg-positive-400" /> {stats.positive} Positive
            </span>
            <span className="flex items-center gap-1.5 text-xs text-surface-500">
              <span className="w-2 h-2 rounded-full bg-neutral_tone-400" /> {stats.neutral} Neutral
            </span>
            <span className="flex items-center gap-1.5 text-xs text-surface-500">
              <span className="w-2 h-2 rounded-full bg-negative-400" /> {stats.negative} Negative
            </span>
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-surface-900">Recent Reviews</h2>
            <Link href="/reviews" className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <DashboardContent />
      </ReviewProvider>
    </AuthProvider>
  );
}
