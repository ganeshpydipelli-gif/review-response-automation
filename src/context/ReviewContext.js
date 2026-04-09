"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { sampleReviews, getSentiment } from "@/lib/data/sampleReviews";
import { buildPrompt } from "@/lib/ai/promptBuilder";
import {
  getReviews,
  setReviews,
  getResponses,
  saveResponse,
  updateResponseStatus,
  addEditRecord,
  getEditHistory,
  isInitialized,
  markInitialized,
} from "@/lib/data/store";
import { useAuth } from "./AuthContext";

const ReviewContext = createContext(null);

export function ReviewProvider({ children }) {
  const { user } = useAuth();
  const [reviews, setReviewsState] = useState([]);
  const [responses, setResponsesState] = useState([]);
  const [editHistory, setEditHistoryState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState(null);

  // Initialize data
  useEffect(() => {
    if (!isInitialized()) {
      setReviews(sampleReviews);
      markInitialized();
    }
    setReviewsState(getReviews());
    setResponsesState(getResponses());
    setEditHistoryState(getEditHistory());
    setLoading(false);
  }, []);

  // Enrich reviews with sentiment
  const enrichedReviews = reviews.map((review) => ({
    ...review,
    sentiment: getSentiment(review.rating),
    response: responses.find((r) => r.reviewId === review.id) || null,
  }));

  const generateResponse = useCallback(
    async (reviewId) => {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      setGeneratingFor(reviewId);

      try {
        const prompt = buildPrompt({
          reviewText: review.text,
          rating: review.rating,
          businessType: user?.businessCategory || "Restaurant",
          tone: user?.preferredTone || "Professional",
          reviewerName: review.reviewerName,
        });

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewText: review.text,
            rating: review.rating,
            businessType: user?.businessCategory || "Restaurant",
            tone: user?.preferredTone || "Professional",
            reviewerName: review.reviewerName,
            prompt,
          }),
        });

        const data = await res.json();

        if (data.response) {
          const newResponses = saveResponse({
            reviewId,
            text: data.response,
            originalText: data.response,
            status: "pending",
            source: data.source,
            tone: user?.preferredTone || "Professional",
          });
          setResponsesState([...newResponses]);
        }
      } catch (error) {
        console.error("Failed to generate response:", error);
      } finally {
        setGeneratingFor(null);
      }
    },
    [reviews, user]
  );

  const approveResponse = useCallback((reviewId) => {
    const newResponses = updateResponseStatus(reviewId, "approved");
    setResponsesState([...newResponses]);
  }, []);

  const publishResponse = useCallback((reviewId) => {
    const newResponses = updateResponseStatus(reviewId, "published");
    setResponsesState([...newResponses]);
  }, []);

  const editResponse = useCallback((reviewId, newText) => {
    const existingResponse = responses.find((r) => r.reviewId === reviewId);
    if (existingResponse) {
      // Track edit for smart learning
      addEditRecord({
        reviewId,
        responseId: existingResponse.id,
        originalText: existingResponse.originalText || existingResponse.text,
        editedText: newText,
        tone: user?.preferredTone || "Professional",
      });
      setEditHistoryState(getEditHistory());
    }

    const newResponses = saveResponse({
      reviewId,
      text: newText,
      status: existingResponse?.status || "pending",
      originalText: existingResponse?.originalText || existingResponse?.text,
    });
    setResponsesState([...newResponses]);
  }, [responses, user]);

  const generateAll = useCallback(async () => {
    const unreplied = reviews.filter(
      (r) => !responses.find((resp) => resp.reviewId === r.id)
    );
    for (const review of unreplied) {
      await generateResponse(review.id);
    }
  }, [reviews, responses, generateResponse]);

  const stats = {
    total: reviews.length,
    positive: reviews.filter((r) => getSentiment(r.rating) === "positive").length,
    neutral: reviews.filter((r) => getSentiment(r.rating) === "neutral").length,
    negative: reviews.filter((r) => getSentiment(r.rating) === "negative").length,
    responded: responses.length,
    approved: responses.filter((r) => r.status === "approved" || r.status === "published").length,
    published: responses.filter((r) => r.status === "published").length,
    pending: responses.filter((r) => r.status === "pending").length,
    responseRate: reviews.length > 0 ? Math.round((responses.length / reviews.length) * 100) : 0,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0",
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews: enrichedReviews,
        responses,
        editHistory,
        loading,
        generatingFor,
        stats,
        generateResponse,
        approveResponse,
        publishResponse,
        editResponse,
        generateAll,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReviews must be used within a ReviewProvider");
  return context;
}
