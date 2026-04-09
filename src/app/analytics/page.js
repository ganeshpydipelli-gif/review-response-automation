"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReviewProvider, useReviews } from "@/context/ReviewContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function AnalyticsContent() {
  const { reviews, stats, responses } = useReviews();

  const sentimentData = [
    { name: "Positive", value: stats.positive, color: "#22c55e" },
    { name: "Neutral", value: stats.neutral, color: "#eab308" },
    { name: "Negative", value: stats.negative, color: "#ef4444" },
  ];

  const statusData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Approved", value: stats.approved - stats.published, color: "#3b82f6" },
    { name: "Published", value: stats.published, color: "#22c55e" },
    { name: "No Response", value: stats.total - stats.responded, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  // Rating distribution
  const ratingDist = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating}★`,
    count: reviews.filter((r) => r.rating === rating).length,
    fill: rating >= 4 ? "#22c55e" : rating === 3 ? "#eab308" : "#ef4444",
  }));

  // Weekly trend (mock based on review dates)
  const weeklyData = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => ({
      day,
      reviews: Math.max(1, Math.floor(reviews.length / 7) + (i % 3)),
      responses: Math.max(0, Math.floor(responses.length / 7) + ((i + 1) % 3)),
    }));
  })();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-surface-100 text-xs">
          <p className="font-medium text-surface-700 mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <Header title="Analytics" subtitle="Insights into your review performance" />
      <div className="p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 animate-slide-up">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">Response Rate</p>
            <p className="text-3xl font-bold text-surface-900">{stats.responseRate}%</p>
            <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
              <div className="h-full gradient-brand rounded-full transition-all duration-700" style={{ width: `${stats.responseRate}%` }} />
            </div>
          </div>
          <div className="card p-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">Avg Rating</p>
            <p className="text-3xl font-bold text-surface-900">{stats.avgRating}</p>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className={`w-4 h-4 ${s <= Math.round(parseFloat(stats.avgRating)) ? "text-amber-400" : "text-surface-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="card p-5 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">Total Responses</p>
            <p className="text-3xl font-bold text-surface-900">{stats.responded}</p>
            <p className="text-xs text-positive-600 font-medium mt-2">
              {stats.published} published
            </p>
          </div>
          <div className="card p-5 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">Needs Attention</p>
            <p className="text-3xl font-bold text-negative-600">{stats.negative}</p>
            <p className="text-xs text-surface-500 mt-2">negative reviews</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Distribution */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Sentiment Distribution</h3>
            <div className="flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {sentimentData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {sentimentData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-surface-600">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-surface-900">{item.value}</span>
                      <span className="text-xs text-surface-400 ml-1">
                        ({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingDist} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="rating" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ratingDist.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Status & Weekly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Status */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Response Status</h3>
            <div className="flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-surface-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-surface-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="reviews" name="Reviews" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="responses" name="Responses" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AnalyticsPage() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <AnalyticsContent />
      </ReviewProvider>
    </AuthProvider>
  );
}
