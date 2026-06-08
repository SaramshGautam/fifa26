/**
 * FIFA World Cup 2026 — Official 48 teams & group draw
 * Source: FIFA.com / Heavy.com verified draw results (Dec 5, 2025)
 *
 * Groups A–L (12 groups × 4 teams each)
 */
export const TEAMS = [
  /* ── Group A ── Mexico, South Africa, Korea Republic, Czechia */
  { id: 1,  name: "Mexico",              flag: "🇲🇽", group: "A", confederation: "CONCACAF" },
  { id: 2,  name: "South Africa",        flag: "🇿🇦", group: "A", confederation: "CAF" },
  { id: 3,  name: "Korea Republic",      flag: "🇰🇷", group: "A", confederation: "AFC" },
  { id: 4,  name: "Czechia",             flag: "🇨🇿", group: "A", confederation: "UEFA" },

  /* ── Group B ── Canada, Bosnia and Herzegovina, Qatar, Switzerland */
  { id: 5,  name: "Canada",              flag: "🇨🇦", group: "B", confederation: "CONCACAF" },
  { id: 6,  name: "Bosnia & Herz.",      flag: "🇧🇦", group: "B", confederation: "UEFA" },
  { id: 7,  name: "Qatar",               flag: "🇶🇦", group: "B", confederation: "AFC" },
  { id: 8,  name: "Switzerland",         flag: "🇨🇭", group: "B", confederation: "UEFA" },

  /* ── Group C ── Brazil, Morocco, Haiti, Scotland */
  { id: 9,  name: "Brazil",              flag: "🇧🇷", group: "C", confederation: "CONMEBOL" },
  { id: 10, name: "Morocco",             flag: "🇲🇦", group: "C", confederation: "CAF" },
  { id: 11, name: "Haiti",               flag: "🇭🇹", group: "C", confederation: "CONCACAF" },
  { id: 12, name: "Scotland",            flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", confederation: "UEFA" },

  /* ── Group D ── USA, Paraguay, Australia, Turkiye */
  { id: 13, name: "USA",                 flag: "🇺🇸", group: "D", confederation: "CONCACAF" },
  { id: 14, name: "Paraguay",            flag: "🇵🇾", group: "D", confederation: "CONMEBOL" },
  { id: 15, name: "Australia",           flag: "🇦🇺", group: "D", confederation: "AFC" },
  { id: 16, name: "Türkiye",             flag: "🇹🇷", group: "D", confederation: "UEFA" },

  /* ── Group E ── Germany, Curaçao, Cote d'Ivoire, Ecuador */
  { id: 17, name: "Germany",             flag: "🇩🇪", group: "E", confederation: "UEFA" },
  { id: 18, name: "Curaçao",             flag: "🇨🇼", group: "E", confederation: "CONCACAF" },
  { id: 19, name: "Côte d'Ivoire",       flag: "🇨🇮", group: "E", confederation: "CAF" },
  { id: 20, name: "Ecuador",             flag: "🇪🇨", group: "E", confederation: "CONMEBOL" },

  /* ── Group F ── Netherlands, Japan, Sweden, Tunisia */
  { id: 21, name: "Netherlands",         flag: "🇳🇱", group: "F", confederation: "UEFA" },
  { id: 22, name: "Japan",               flag: "🇯🇵", group: "F", confederation: "AFC" },
  { id: 23, name: "Sweden",              flag: "🇸🇪", group: "F", confederation: "UEFA" },
  { id: 24, name: "Tunisia",             flag: "🇹🇳", group: "F", confederation: "CAF" },

  /* ── Group G ── Belgium, Egypt, IR Iran, New Zealand */
  { id: 25, name: "Belgium",             flag: "🇧🇪", group: "G", confederation: "UEFA" },
  { id: 26, name: "Egypt",               flag: "🇪🇬", group: "G", confederation: "CAF" },
  { id: 27, name: "IR Iran",             flag: "🇮🇷", group: "G", confederation: "AFC" },
  { id: 28, name: "New Zealand",         flag: "🇳🇿", group: "G", confederation: "OFC" },

  /* ── Group H ── Spain, Cabo Verde, Saudi Arabia, Uruguay */
  { id: 29, name: "Spain",               flag: "🇪🇸", group: "H", confederation: "UEFA" },
  { id: 30, name: "Cabo Verde",          flag: "🇨🇻", group: "H", confederation: "CAF" },
  { id: 31, name: "Saudi Arabia",        flag: "🇸🇦", group: "H", confederation: "AFC" },
  { id: 32, name: "Uruguay",             flag: "🇺🇾", group: "H", confederation: "CONMEBOL" },

  /* ── Group I ── France, Senegal, Iraq, Norway */
  { id: 33, name: "France",              flag: "🇫🇷", group: "I", confederation: "UEFA" },
  { id: 34, name: "Senegal",             flag: "🇸🇳", group: "I", confederation: "CAF" },
  { id: 35, name: "Iraq",                flag: "🇮🇶", group: "I", confederation: "AFC" },
  { id: 36, name: "Norway",              flag: "🇳🇴", group: "I", confederation: "UEFA" },

  /* ── Group J ── Argentina, Algeria, Austria, Jordan */
  { id: 37, name: "Argentina",           flag: "🇦🇷", group: "J", confederation: "CONMEBOL" },
  { id: 38, name: "Algeria",             flag: "🇩🇿", group: "J", confederation: "CAF" },
  { id: 39, name: "Austria",             flag: "🇦🇹", group: "J", confederation: "UEFA" },
  { id: 40, name: "Jordan",              flag: "🇯🇴", group: "J", confederation: "AFC" },

  /* ── Group K ── Portugal, Congo DR, Uzbekistan, Colombia */
  { id: 41, name: "Portugal",            flag: "🇵🇹", group: "K", confederation: "UEFA" },
  { id: 42, name: "Congo DR",            flag: "🇨🇩", group: "K", confederation: "CAF" },
  { id: 43, name: "Uzbekistan",          flag: "🇺🇿", group: "K", confederation: "AFC" },
  { id: 44, name: "Colombia",            flag: "🇨🇴", group: "K", confederation: "CONMEBOL" },

  /* ── Group L ── England, Croatia, Ghana, Panama */
  { id: 45, name: "England",             flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", confederation: "UEFA" },
  { id: 46, name: "Croatia",             flag: "🇭🇷", group: "L", confederation: "UEFA" },
  { id: 47, name: "Ghana",               flag: "🇬🇭", group: "L", confederation: "CAF" },
  { id: 48, name: "Panama",              flag: "🇵🇦", group: "L", confederation: "CONCACAF" },
];

/** All 12 group identifiers in order */
export const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

/** Returns the 4 teams in a given group letter */
export function getTeamsByGroup(groupLetter) {
  return TEAMS.filter((t) => t.group === groupLetter);
}
