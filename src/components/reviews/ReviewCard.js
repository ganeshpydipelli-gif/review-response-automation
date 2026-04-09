"use client";

import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import StarRating from "./StarRating";
import SentimentBadge from "./SentimentBadge";
import EditModal from "./EditModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useReviews } from "@/context/ReviewContext";
import { useToast } from "@/context/ToastContext";

export default function ReviewCard({ review }) {
  const { generateResponse, approveResponse, publishResponse, editResponse, generatingFor } = useReviews();
  const { addToast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const isGenerating = generatingFor === review.id;

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-blue-50 text-blue-700 border-blue-200",
    published: "bg-positive-50 text-positive-700 border-positive-200",
  };

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    published: "Published",
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <div className="card p-6 animate-fade-in">
        {/* Review Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={review.reviewerName} size="md" />
            <div>
              <h3 className="font-semibold text-surface-900 text-sm">{review.reviewerName}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-surface-400">{formatDate(review.date)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SentimentBadge sentiment={review.sentiment} size="sm" />
            {review.response && (
              <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${statusStyles[review.response.status]}`}>
                {statusLabels[review.response.status]}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-sm text-surface-600 leading-relaxed mb-4 pl-[52px]">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* AI Response Section */}
        <div className="pl-[52px]">
          {isGenerating ? (
            <div className="bg-brand-50/50 rounded-xl p-4 border border-brand-100">
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-brand-600 font-medium">Generating AI response...</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 shimmer-loading rounded w-full" />
                <div className="h-3 shimmer-loading rounded w-4/5" />
                <div className="h-3 shimmer-loading rounded w-3/5" />
              </div>
            </div>
          ) : review.response ? (
            <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">AI Response</span>
                {review.response.source === "openai" && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">GPT</span>
                )}
              </div>
              <p className="text-sm text-surface-700 leading-relaxed">{review.response.text}</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-100">
                {review.response.status === "pending" && (
                  <button
                    onClick={() => {
                      approveResponse(review.id);
                      addToast(`Response approved for ${review.reviewerName} ✅`, "info");
                    }}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </span>
                  </button>
                )}
                {review.response.status === "approved" && (
                  <button
                    onClick={() => {
                      publishResponse(review.id);
                      addToast("Response published successfully! ✨", "success");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-positive-500 hover:bg-positive-600 hover:shadow-lg hover:shadow-positive-500/25 active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      Publish
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setShowEdit(true)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </span>
                </button>
                <button
                  onClick={() => generateResponse(review.id)}
                  className="btn-ghost text-xs px-4 py-2"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => generateResponse(review.id)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-surface-200 
                text-sm text-surface-400 hover:border-brand-300 hover:text-brand-500 hover:bg-brand-50/50
                transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generate AI Response
            </button>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        review={review}
        currentText={review.response?.text || ""}
        onSave={(newText) => {
          editResponse(review.id, newText);
          setShowEdit(false);
          addToast("Response updated — AI is learning your style! 🧠", "info");
        }}
      />
    </>
  );
}
