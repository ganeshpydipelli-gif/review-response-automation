import "./globals.css";

export const metadata = {
  title: "ReviewAI - Smart Review Response Automation",
  description:
    "AI-powered review response automation for local businesses. Generate, review, and publish responses to customer reviews effortlessly.",
  keywords: ["review automation", "AI responses", "customer reviews", "business management"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
