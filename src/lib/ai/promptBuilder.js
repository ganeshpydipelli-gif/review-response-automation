import { getLearningInsights } from "@/lib/data/store";

export function buildPrompt({ reviewText, rating, businessType, tone, reviewerName }) {
  const insights = getLearningInsights();

  let learningContext = "";
  if (insights.totalEdits > 3) {
    learningContext = `\n\nIMPORTANT - User Style Preferences (learned from ${insights.totalEdits} previous edits):\n`;
    if (insights.preferredLength === "longer") {
      learningContext += `- The user prefers slightly longer, more detailed responses\n`;
    } else if (insights.preferredLength === "shorter") {
      learningContext += `- The user prefers shorter, more concise responses\n`;
    }
    insights.commonPatterns.forEach((p) => {
      learningContext += `- ${p}\n`;
    });
  }

  return `You are a business owner responding to a customer review.

Business Type: ${businessType || "Restaurant"}
Tone: ${tone || "Professional"}
Customer Name: ${reviewerName || "Customer"}
Customer Review: "${reviewText}"
Rating: ${rating}/5 stars

Write a short, human-like response that:
- Thanks the customer by name
- Addresses their specific feedback
- Apologizes sincerely if the review is negative (1-2 stars)
- Invites them back if appropriate
- Keeps it under 80 words
- Does NOT sound robotic or generic
- Matches the specified tone (${tone || "Professional"})
${learningContext}

Response:`;
}
