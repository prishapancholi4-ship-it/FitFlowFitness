const BADGE_ICONS = {
  hydration: "💧",
  sleep: "🌙",
  workout: "🏋️",
  nutrition: "🥗",
  streak: "🔥",
  level: "⭐",
  mindfulness: "🧘",
  journal: "📓",
  blog: "💬",
  shop: "🛒",
  challenge: "🎯",
  steps: "👣",
  weight: "⚖️",
  consistency: "📅",
  motivation: "⚡",
  time: "⏰",
  events: "🎉",
  mindset: "🌱",
  community: "🤝",
  milestone: "🏆",
  rare: "💎",
  fun: "🌈"
};

function getBadgeIcon(name) {
  if (HYDRATION_BADGES.includes(name)) return BADGE_ICONS.hydration;
  if (SLEEP_BADGES.includes(name)) return BADGE_ICONS.sleep;
  if (WORKOUT_BADGES.includes(name)) return BADGE_ICONS.workout;
  if (NUTRITION_BADGES.includes(name)) return BADGE_ICONS.nutrition;
  if (STREAK_BADGES.includes(name)) return BADGE_ICONS.streak;
  if (LEVEL_BADGES.includes(name)) return BADGE_ICONS.level;
  if (MINDFULNESS_BADGES.includes(name)) return BADGE_ICONS.mindfulness;
  if (JOURNAL_BADGES.includes(name)) return BADGE_ICONS.journal;
  if (BLOG_BADGES.includes(name)) return BADGE_ICONS.blog;
  if (SHOP_BADGES.includes(name)) return BADGE_ICONS.shop;
  if (CHALLENGE_BADGES.includes(name)) return BADGE_ICONS.challenge;
  if (STEP_BADGES.includes(name)) return BADGE_ICONS.steps;
  if (WEIGHT_BADGES.includes(name)) return BADGE_ICONS.weight;
  if (CONSISTENCY_BADGES.includes(name)) return BADGE_ICONS.consistency;
  if (MOTIVATION_BADGES.includes(name)) return BADGE_ICONS.motivation;
  if (TIME_BADGES.includes(name)) return BADGE_ICONS.time;
  if (EVENT_BADGES.includes(name)) return BADGE_ICONS.events;
  if (MINDSET_BADGES.includes(name)) return BADGE_ICONS.mindset;
  if (COMMUNITY_BADGES.includes(name)) return BADGE_ICONS.community;
  if (MILESTONE_BADGES.includes(name)) return BADGE_ICONS.milestone;
  if (RARE_BADGES.includes(name)) return BADGE_ICONS.rare;
  if (FUN_BADGES.includes(name)) return BADGE_ICONS.fun;

  return "✨";
}
