// Centralised design data keeps the page component lean while letting us
// mirror the Planora layout structure (sidebar navigation, quick actions, etc.).

export const sidebarSections = [
  {
    label: "AI Chat Helper",
    badge: 2,
    items: [
      "Daily briefs",
      "Prompt templates",
      "Conversation starters",
    ],
  },
  {
    label: "Explore KAISA",
    badge: 2,
    items: ["Dashboard", "Knowledge Hub", "Persona Library"],
  },
  {
    label: "Quick Actions Hub",
    badge: 2,
    items: ["Launch workflows", "Upload documents", "Share insights"],
  },
  {
    label: "Smart Insights",
    badge: 2,
    items: ["Industry trends", "Customer sentiment"],
  },
];

export const recentTopics = [
  "What is a responsive web design?",
  "Tips for choosing the best hosting provider",
  "Which JavaScript framework is right for me?",
  "How to create an effective landing page?",
];

export const favoriteTopics = [
  "How to optimise your website for conversions",
  "The best tools for designing a mobile app",
  "Understanding the basics of SEO",
];

export const quickActionCards = [
  {
    title: "Code Generator",
    caption: "Generate dev-ready components in seconds",
    prompt: "generate CSS for body: Arial font, dark text, blue gradient background",
  },
  {
    title: "Presentation & Slide",
    caption: "Craft polished decks with structured outlines",
    prompt: "generate a slide design with a clean layout and bold headings",
  },
  {
    title: "Marketing Copy",
    caption: "Write compelling messaging tailored to your audience",
    prompt: "write a compelling headline for a new e-commerce website",
  },
];

export const insightShortcuts = [
  {
    title: "Upgrade to KAISA Pro",
    details: "Unlock premium automations, priority support, and deeper analytics.",
    action: "Don't miss out",
  },
];


