export const DEFAULT_AGENT = {
  id: "kaisa-default",
  title: "Teacher KAI",
  displayName: "Teacher KAI",
  icon: "/images/kai.png",
  content:
    "Hey there! 👋 I’m Teacher KAI, your guide for today. What are we exploring? Need help with a task, a concept, or just curious about something new?",
};

export const AGENT_PROFILES = {
  curriculum: {
    id: "curriculum",
    title: "Curriculum Agent",
    displayName: "Principal Aralyn",
    icon: "/images/aralyn.png",
    content:
      "Hello! I’m Principal Aralyn. ✨ Let’s make sure everything’s in order. What lesson, topic, or plan do you need help perfecting today?",
  },
  quizzer: {
    id: "quizzer",
    title: "Quizzer Agent",
    displayName: "Tallya",
    icon: "/images/tallya.png",
    content:
      "Hi! I’m Tallya, your study buddy! 📝 Ready to tackle some questions or quiz yourself? Let’s get you acing this together—challenge accepted!",
  },
  review: {
    id: "review",
    title: "Review Agent",
    displayName: "Kuya Revi",
    icon: "/images/revi.png",
    content:
      "Hey! Kuya Revi here. 😎 Don’t worry, we’ll go step by step. What are we reviewing today? I’ll guide you and maybe throw in a joke or two while we learn!",
  },
} as const;

export type AgentProfile = typeof DEFAULT_AGENT | (typeof AGENT_PROFILES)[keyof typeof AGENT_PROFILES];

export const AGENT_PROFILES_BY_TITLE: Record<string, AgentProfile> = {
  [AGENT_PROFILES.curriculum.title]: AGENT_PROFILES.curriculum,
  [AGENT_PROFILES.quizzer.title]: AGENT_PROFILES.quizzer,
  [AGENT_PROFILES.review.title]: AGENT_PROFILES.review,
};

export const AGENT_PROFILES_BY_ID: Record<string, AgentProfile> = {
  [DEFAULT_AGENT.id]: DEFAULT_AGENT,
  [AGENT_PROFILES.curriculum.id]: AGENT_PROFILES.curriculum,
  [AGENT_PROFILES.quizzer.id]: AGENT_PROFILES.quizzer,
  [AGENT_PROFILES.review.id]: AGENT_PROFILES.review,
};
