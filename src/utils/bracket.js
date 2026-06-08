/**
 * bracket.js — full FIFA 2026 knockout bracket logic.
 *
 * Official match numbers (from FIFA/CBS/NBC schedule published Dec 6 2025):
 *
 * ROUND OF 32 (matches 73–88):
 *  73: R-A  vs R-B       84: W-H  vs R-J
 *  74: W-E  vs T(ABCDF) 85: W-B  vs T(EFGIJ)
 *  75: W-F  vs R-C       86: W-J  vs R-H
 *  76: W-C  vs R-F       87: W-K  vs T(DEIJL)
 *  77: W-I  vs T(CDFGH) 88: R-D  vs R-G
 *  78: R-E  vs R-I
 *  79: W-A  vs T(CEFHI)
 *  80: W-L  vs T(EHIJK)
 *  81: W-D  vs T(BEFIJ)
 *  82: W-G  vs T(AEHIJ)
 *  83: R-K  vs R-L
 *
 * ROUND OF 16 (matches 89–96):
 *  89: W73  vs W75   (Philadelphia)
 *  90: W74  vs W77   (Houston) — NOTE: NBC/CBS sources say M89=W74vW77, M90=W73vW75
 *       → Using CBS/NBC which published post-draw: M89=W74vW77, M90=W73vW75
 *  91: W76  vs W78   (New York/New Jersey)
 *  92: W79  vs W80   (Mexico City)
 *  93: W83  vs W84   (Dallas)
 *  94: W81  vs W82   (Seattle)
 *  95: W86  vs W88   (Atlanta)
 *  96: W85  vs W87   (Vancouver)
 *
 * QUARTER-FINALS (matches 97–100):
 *  97: W89  vs W90   (Boston)
 *  98: W91  vs W92   (?)
 *  99: W93  vs W94   (?)
 * 100: W95  vs W96   (?)
 *
 * SEMI-FINALS (matches 101–102):
 * 101: W97  vs W98
 * 102: W99  vs W100
 *
 * FINAL (match 103):
 * 103: W101 vs W102  (MetLife Stadium, NJ — July 19 2026)
 */

import { GROUPS } from "../data/teams";

/** Extract winners, runners-up, thirds from group predictions */
export function extractGroupResults(groupPredictions = {}) {
  const winners   = [];
  const runnersUp = [];
  const thirds    = [];

  GROUPS.forEach((g) => {
    const slots = groupPredictions[g] || [null, null, null];
    if (slots[0]) winners.push({ ...slots[0],   groupLetter: g, role: "winner"    });
    if (slots[1]) runnersUp.push({ ...slots[1], groupLetter: g, role: "runner-up" });
    if (slots[2]) thirds.push({ ...slots[2],    groupLetter: g, role: "3rd place" });
  });

  return { winners, runnersUp, thirds };
}

/** Check group stage is complete enough to build R32 (all 12 winners + runners-up picked) */
export function groupCompletionRatio(groupPredictions = {}) {
  const { winners, runnersUp } = extractGroupResults(groupPredictions);
  return (winners.length + runnersUp.length) / 24;
}

/**
 * Build the 16 official R32 matchups.
 * Third-place slots are filled from chosenThirds in the order shown.
 */
export function buildR32Matchups(groupPredictions = {}, chosenThirds = []) {
  const { winners, runnersUp } = extractGroupResults(groupPredictions);

  const W = {};
  const R = {};
  winners.forEach((t)   => { W[t.groupLetter] = t; });
  runnersUp.forEach((t) => { R[t.groupLetter] = t; });

  // Map chosen thirds to the 8 third-place slots in bracket order
  // Slot labels reflect which groups can supply that third (per official draw)
  const thirdSlots = [
    { label: "Best 3rd (A/B/C/D/F)", team: chosenThirds[0] || null },  // M74
    { label: "Best 3rd (C/D/F/G/H)", team: chosenThirds[1] || null },  // M77
    { label: "Best 3rd (C/E/F/H/I)", team: chosenThirds[2] || null },  // M79
    { label: "Best 3rd (E/H/I/J/K)", team: chosenThirds[3] || null },  // M80
    { label: "Best 3rd (B/E/F/I/J)", team: chosenThirds[4] || null },  // M81
    { label: "Best 3rd (A/E/H/I/J)", team: chosenThirds[5] || null },  // M82
    { label: "Best 3rd (E/F/G/I/J)", team: chosenThirds[6] || null },  // M85
    { label: "Best 3rd (D/E/I/J/L)", team: chosenThirds[7] || null },  // M87
  ];

  const T = (i) => thirdSlots[i]?.team || null;
  const tRole = (i) => thirdSlots[i]?.label || "3rd place";

  return [
    { id: "m73",  matchNo: 73,  home: R["A"],  homeRole: "R-A runner-up",  away: R["B"],  awayRole: "R-B runner-up"  },
    { id: "m74",  matchNo: 74,  home: W["E"],  homeRole: "W-E winner",     away: T(0),    awayRole: tRole(0)         },
    { id: "m75",  matchNo: 75,  home: W["F"],  homeRole: "W-F winner",     away: R["C"],  awayRole: "R-C runner-up"  },
    { id: "m76",  matchNo: 76,  home: W["C"],  homeRole: "W-C winner",     away: R["F"],  awayRole: "R-F runner-up"  },
    { id: "m77",  matchNo: 77,  home: W["I"],  homeRole: "W-I winner",     away: T(1),    awayRole: tRole(1)         },
    { id: "m78",  matchNo: 78,  home: R["E"],  homeRole: "R-E runner-up",  away: R["I"],  awayRole: "R-I runner-up"  },
    { id: "m79",  matchNo: 79,  home: W["A"],  homeRole: "W-A winner",     away: T(2),    awayRole: tRole(2)         },
    { id: "m80",  matchNo: 80,  home: W["L"],  homeRole: "W-L winner",     away: T(3),    awayRole: tRole(3)         },
    { id: "m81",  matchNo: 81,  home: W["D"],  homeRole: "W-D winner",     away: T(4),    awayRole: tRole(4)         },
    { id: "m82",  matchNo: 82,  home: W["G"],  homeRole: "W-G winner",     away: T(5),    awayRole: tRole(5)         },
    { id: "m83",  matchNo: 83,  home: R["K"],  homeRole: "R-K runner-up",  away: R["L"],  awayRole: "R-L runner-up"  },
    { id: "m84",  matchNo: 84,  home: W["H"],  homeRole: "W-H winner",     away: R["J"],  awayRole: "R-J runner-up"  },
    { id: "m85",  matchNo: 85,  home: W["B"],  homeRole: "W-B winner",     away: T(6),    awayRole: tRole(6)         },
    { id: "m86",  matchNo: 86,  home: W["J"],  homeRole: "W-J winner",     away: R["H"],  awayRole: "R-H runner-up"  },
    { id: "m87",  matchNo: 87,  home: W["K"],  homeRole: "W-K winner",     away: T(7),    awayRole: tRole(7)         },
    { id: "m88",  matchNo: 88,  home: R["D"],  homeRole: "R-D runner-up",  away: R["G"],  awayRole: "R-G runner-up"  },
  ];
}

/**
 * Build the 8 official R16 matchups from r32Winners.
 * r32Winners is a length-16 array indexed 0-15 = matches 73-88.
 *
 * Official pairings (NBC/CBS post-draw):
 *  M89: W74 vs W77  → r32[1] vs r32[4]
 *  M90: W73 vs W75  → r32[0] vs r32[2]
 *  M91: W76 vs W78  → r32[3] vs r32[5]
 *  M92: W79 vs W80  → r32[6] vs r32[7]
 *  M93: W83 vs W84  → r32[10] vs r32[11]
 *  M94: W81 vs W82  → r32[8] vs r32[9]
 *  M95: W86 vs W88  → r32[13] vs r32[15]
 *  M96: W85 vs W87  → r32[12] vs r32[14]
 */
export function buildR16Matchups(r32Winners = []) {
  const w = (i) => r32Winners[i] || null;
  const label = (i) => `Winner Match ${73 + i}`;

  return [
    { id: "m89",  matchNo: 89,  home: w(1),  homeLabel: label(1),  away: w(4),  awayLabel: label(4)  },
    { id: "m90",  matchNo: 90,  home: w(0),  homeLabel: label(0),  away: w(2),  awayLabel: label(2)  },
    { id: "m91",  matchNo: 91,  home: w(3),  homeLabel: label(3),  away: w(5),  awayLabel: label(5)  },
    { id: "m92",  matchNo: 92,  home: w(6),  homeLabel: label(6),  away: w(7),  awayLabel: label(7)  },
    { id: "m93",  matchNo: 93,  home: w(10), homeLabel: label(10), away: w(11), awayLabel: label(11) },
    { id: "m94",  matchNo: 94,  home: w(8),  homeLabel: label(8),  away: w(9),  awayLabel: label(9)  },
    { id: "m95",  matchNo: 95,  home: w(13), homeLabel: label(13), away: w(15), awayLabel: label(15) },
    { id: "m96",  matchNo: 96,  home: w(12), homeLabel: label(12), away: w(14), awayLabel: label(14) },
  ];
}

/**
 * Build the 4 official QF matchups from r16Winners.
 *  M97: W89 vs W90  → r16[0] vs r16[1]
 *  M98: W91 vs W92  → r16[2] vs r16[3]
 *  M99: W93 vs W94  → r16[4] vs r16[5]
 * M100: W95 vs W96  → r16[6] vs r16[7]
 */
export function buildQFMatchups(r16Winners = []) {
  const w = (i) => r16Winners[i] || null;
  const label = (i) => `Winner Match ${89 + i}`;

  return [
    { id: "m97",  matchNo: 97,  home: w(0), homeLabel: label(0), away: w(1), awayLabel: label(1) },
    { id: "m98",  matchNo: 98,  home: w(2), homeLabel: label(2), away: w(3), awayLabel: label(3) },
    { id: "m99",  matchNo: 99,  home: w(4), homeLabel: label(4), away: w(5), awayLabel: label(5) },
    { id: "m100", matchNo: 100, home: w(6), homeLabel: label(6), away: w(7), awayLabel: label(7) },
  ];
}

/**
 * Build the 2 official SF matchups from qfWinners.
 * M101: W97 vs W98  → qf[0] vs qf[1]
 * M102: W99 vs W100 → qf[2] vs qf[3]
 */
export function buildSFMatchups(qfWinners = []) {
  const w = (i) => qfWinners[i] || null;
  return [
    { id: "m101", matchNo: 101, home: w(0), homeLabel: "Winner QF Match 97",  away: w(1), awayLabel: "Winner QF Match 98"  },
    { id: "m102", matchNo: 102, home: w(2), homeLabel: "Winner QF Match 99",  away: w(3), awayLabel: "Winner QF Match 100" },
  ];
}

/**
 * Build the Final matchup from sfWinners.
 * M103: W101 vs W102
 */
export function buildFinalMatchup(sfWinners = []) {
  return [
    {
      id: "m103",
      matchNo: 103,
      home: sfWinners[0] || null,
      homeLabel: "Winner SF Match 101",
      away: sfWinners[1] || null,
      awayLabel: "Winner SF Match 102",
    },
  ];
}
