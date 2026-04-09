import { NextResponse } from "next/server";
import { generateFallbackResponse } from "@/lib/ai/fallbackGenerator";

export async function POST(request) {
  try {
    const body = await request.json();
    const { reviewText, rating, businessType, tone, reviewerName, prompt } = body;

    // Try OpenAI first
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== "your_openai_api_key_here") {
      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that writes professional business review responses. Keep responses under 80 words, natural, and human-like.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        const responseText = completion.choices[0]?.message?.content?.trim();
        if (responseText) {
          return NextResponse.json({ response: responseText, source: "openai" });
        }
      } catch (aiError) {
        console.error("OpenAI API error, falling back to template:", aiError.message);
      }
    }

    // Fallback to template-based generation
    // Add a small delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = generateFallbackResponse({
      reviewText,
      rating,
      tone,
      reviewerName,
    });

    return NextResponse.json({ response, source: "fallback" });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
