// Fallback response generator used when OpenAI API key is not configured
// Produces realistic, context-aware responses using templates

const positiveTemplates = {
  Professional: [
    "Thank you so much for your wonderful review, {name}! We're thrilled to hear about your positive experience. {specific} Your satisfaction means the world to our team. We look forward to welcoming you back soon!",
    "We truly appreciate your kind words, {name}! {specific} It's feedback like yours that motivates our entire team. We'd love to see you again soon!",
    "{name}, thank you for this amazing review! {specific} We take great pride in delivering excellent experiences, and your feedback confirms we're on the right track. See you next time!",
  ],
  Friendly: [
    "Wow, thank you so much, {name}! 😊 {specific} You totally made our day with this review! Can't wait to see you again - we'll have something special waiting!",
    "Hey {name}! Thanks for the awesome review! {specific} We're so happy you had a great time! Come back soon - the next visit will be even better! 🎉",
    "{name}, you're the best! 🙌 {specific} Reviews like yours keep us going! Hope to see you again real soon!",
  ],
  Apologetic: [
    "Thank you for your kind review, {name}. {specific} We're always looking to improve, and we appreciate your support. We hope to exceed your expectations on your next visit!",
    "{name}, we're grateful for your thoughtful feedback! {specific} We're glad you enjoyed your experience and we'll continue working hard to make it even better!",
  ],
  Promotional: [
    "Thank you, {name}! {specific} We're so glad you enjoyed it! Did you know we have new specials every week? Follow us on social media to stay updated. See you soon!",
    "We appreciate you, {name}! {specific} As a thank you, ask about our loyalty program on your next visit - we love rewarding our regulars! 🌟",
  ],
};

const neutralTemplates = {
  Professional: [
    "Thank you for your feedback, {name}. {specific} We appreciate your honest assessment and are always working to improve. We'd love the opportunity to provide a better experience next time.",
    "{name}, we value your review. {specific} Your suggestions help us grow. We hope to welcome you back and deliver an experience that exceeds your expectations.",
  ],
  Friendly: [
    "Thanks for the honest review, {name}! {specific} We hear you and we're on it! Give us another shot - we promise to step it up! 😊",
    "Hey {name}, thanks for sharing your thoughts! {specific} We appreciate your honesty and we're working on making things even better. Hope to see you again!",
  ],
  Apologetic: [
    "Thank you for your candid feedback, {name}. {specific} We're sorry we didn't fully meet your expectations. We take every review seriously and are working to improve. Please give us another chance!",
    "{name}, we appreciate your honest review. {specific} We're disappointed we didn't wow you this time. We're making changes and would love a second chance to impress you.",
  ],
  Promotional: [
    "Thanks for the feedback, {name}! {specific} We're always improving! Come try our latest seasonal specials - we think you'll notice the difference. First drink on us! 🍷",
  ],
};

const negativeTemplates = {
  Professional: [
    "Thank you for bringing this to our attention, {name}. {specific} We sincerely apologize for falling short of your expectations. We've shared your feedback with our team and are taking immediate steps to address this. Please reach out to us directly so we can make this right.",
    "{name}, we're deeply sorry about your experience. {specific} This does not reflect our standards. We've already begun addressing this issue. We'd appreciate the chance to make it up to you.",
  ],
  Friendly: [
    "Oh no, {name}! We're really sorry to hear about your experience. {specific} This isn't the standard we set for ourselves. Please reach out to us - we'd love to make it right and turn this around! 💙",
    "{name}, we feel terrible about this! {specific} You deserved so much better. Please let us make it up to you - DM us and we'll sort this out right away!",
  ],
  Apologetic: [
    "We are truly sorry, {name}. {specific} There's no excuse for what happened. We've already taken steps to ensure this doesn't happen again. We would be grateful for the chance to restore your faith in us. Please contact us directly.",
    "{name}, please accept our sincerest apologies. {specific} We take full responsibility and have immediately addressed this with our team. Your experience matters deeply to us. We'd love a chance to make things right.",
  ],
  Promotional: [
    "We sincerely apologize, {name}. {specific} This isn't the experience we want anyone to have. Please contact us directly - we'd like to offer you a complimentary visit to show you what we're really about.",
  ],
};

function getSpecificFeedback(text, rating) {
  if (rating >= 4) {
    if (text.toLowerCase().includes("food")) return "We're delighted you enjoyed the food!";
    if (text.toLowerCase().includes("service") || text.toLowerCase().includes("staff")) return "Our team will be thrilled to hear your kind words!";
    if (text.toLowerCase().includes("atmosphere") || text.toLowerCase().includes("ambiance")) return "We put a lot of thought into creating the right atmosphere!";
    if (text.toLowerCase().includes("birthday") || text.toLowerCase().includes("celebration")) return "It was our pleasure to be part of your special celebration!";
    return "We're so happy you had a great experience!";
  }
  if (rating === 3) {
    if (text.toLowerCase().includes("wait") || text.toLowerCase().includes("slow")) return "We understand how frustrating wait times can be.";
    if (text.toLowerCase().includes("menu") || text.toLowerCase().includes("variety")) return "We're currently reviewing our menu to offer more variety.";
    if (text.toLowerCase().includes("bland") || text.toLowerCase().includes("seasoning")) return "We've noted your feedback about the flavors.";
    return "We appreciate your constructive feedback.";
  }
  // Negative
  if (text.toLowerCase().includes("sick") || text.toLowerCase().includes("food poisoning")) return "Food safety is our top priority and we take this extremely seriously.";
  if (text.toLowerCase().includes("rude") || text.toLowerCase().includes("dismissive")) return "Our staff should always treat guests with respect and courtesy.";
  if (text.toLowerCase().includes("wait") || text.toLowerCase().includes("wrong order")) return "We understand how frustrating service delays and mistakes can be.";
  if (text.toLowerCase().includes("hair") || text.toLowerCase().includes("dirty")) return "Cleanliness and hygiene are non-negotiable standards for us.";
  return "We take your concerns very seriously.";
}

export function generateFallbackResponse({ reviewText, rating, tone, reviewerName }) {
  const sentiment = rating >= 4 ? "positive" : rating === 3 ? "neutral" : "negative";
  const toneKey = tone || "Professional";

  let templates;
  switch (sentiment) {
    case "positive": templates = positiveTemplates[toneKey] || positiveTemplates.Professional; break;
    case "neutral": templates = neutralTemplates[toneKey] || neutralTemplates.Professional; break;
    case "negative": templates = negativeTemplates[toneKey] || negativeTemplates.Professional; break;
    default: templates = positiveTemplates.Professional;
  }

  const template = templates[Math.floor(Math.random() * templates.length)];
  const specific = getSpecificFeedback(reviewText, rating);
  const firstName = (reviewerName || "valued customer").split(" ")[0];

  return template.replace(/{name}/g, firstName).replace(/{specific}/g, specific);
}
