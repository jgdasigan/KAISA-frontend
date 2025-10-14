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
    title: "Curriculum Agent",
    caption: "Design personalized lesson plans and study paths",
    prompt: "create a weekly learning plan for 5th-grade math covering fractions and decimals",
  },
  {
    title: "Quizzer Agent",
    caption: "Generate interactive quizzes and practice tests instantly",
    prompt: "generate a 10-question multiple-choice quiz on photosynthesis with answers",
  },
  {
    title: "Review Agent",
    caption: "Summarize lessons and reinforce key concepts for better retention",
    prompt: "summarize the key points of a english lesson on subject-verb agreement for 7th graders",
  },
];


