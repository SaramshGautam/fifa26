/**
 * FIFA World Cup 2026 — Tournament Stage Definitions
 *
 * Format:
 *  • 48 teams, 12 groups of 4
 *  • Top 2 per group (24) + 8 best 3rd-place = 32 teams
 *  • R32 → R16 → QF → SF → Final (July 19, MetLife Stadium NJ)
 */

/** Tab navigation */
export const TABS = [
  { id: "group", label: "Group Stage",    icon: "⚽" },
  { id: "r32",   label: "Round of 32",    icon: "🏟️" },
  { id: "r16",   label: "Round of 16",    icon: "🎯" },
  { id: "qf",    label: "Quarter-Finals", icon: "⚔️" },
  { id: "sf",    label: "Semi-Finals",    icon: "🔥" },
  { id: "final", label: "Final",          icon: "🏆" },
  { id: "view",  label: "My Bracket",     icon: "📋" },
];

/** Group stage slot labels per group */
export const GROUP_SLOT_LABELS = ["1st Place", "2nd Place", "Best 3rd"];

/** All prediction storage keys */
export const ALL_STAGE_IDS = [
  "group",
  "r32Thirds",
  "r32Winners",
  "r16Winners",
  "qfWinners",
  "sfWinners",
  "final",
];
