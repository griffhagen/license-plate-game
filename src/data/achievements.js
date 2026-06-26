import { STATES, TOTAL_STATES } from './states.js';
import { BONUS_PLATES } from './bonusPlates.js';

const NEW_ENGLAND = ['ME', 'NH', 'VT', 'MA', 'RI', 'CT'];
const WEST_COAST = ['CA', 'OR', 'WA'];
const SOUTHWEST = ['AZ', 'NM', 'TX', 'OK'];

function codesOf(findings) {
  return new Set(findings.map((f) => f.stateCode));
}

/**
 * Each achievement: id, name, description, emoji, and a check(findings) -> bool.
 * `findings` is the full findings list (states + bonus) for the trip.
 */
export const ACHIEVEMENTS = [
  {
    id: 'first-plate',
    name: 'First Sighting',
    emoji: '🚗',
    description: 'Log your very first plate.',
    check: (findings) => findings.length >= 1,
  },
  {
    id: 'ten-plates',
    name: 'Road Warrior',
    emoji: '🛣️',
    description: 'Find 10 plates total.',
    check: (findings) => findings.length >= 10,
  },
  {
    id: 'twenty-five-states',
    name: 'Halfway There',
    emoji: '🌎',
    description: 'Find 25 of the 50 states.',
    check: (findings) => codesOf(findings).size >= 25,
  },
  {
    id: 'all-states',
    name: 'All 50!',
    emoji: '🏆',
    description: `Find all ${TOTAL_STATES} states.`,
    check: (findings) => {
      const codes = codesOf(findings);
      return STATES.every((s) => codes.has(s.code));
    },
  },
  {
    id: 'new-england',
    name: 'New England Sweep',
    emoji: '🍂',
    description: 'Find all six New England states.',
    check: (findings) => {
      const codes = codesOf(findings);
      return NEW_ENGLAND.every((c) => codes.has(c));
    },
  },
  {
    id: 'west-coast',
    name: 'West Coast Trifecta',
    emoji: '🌊',
    description: 'Find California, Oregon, and Washington.',
    check: (findings) => {
      const codes = codesOf(findings);
      return WEST_COAST.every((c) => codes.has(c));
    },
  },
  {
    id: 'southwest',
    name: 'Desert Run',
    emoji: '🌵',
    description: 'Find Arizona, New Mexico, Texas, and Oklahoma.',
    check: (findings) => {
      const codes = codesOf(findings);
      return SOUTHWEST.every((c) => codes.has(c));
    },
  },
  {
    id: 'rare-find',
    name: 'Rare Find',
    emoji: '⭐',
    description: 'Spot a state with rarity 8 or higher.',
    check: (findings) => {
      const codes = codesOf(findings);
      return STATES.some((s) => s.rarity >= 8 && codes.has(s.code));
    },
  },
  {
    id: 'tribal-nation',
    name: 'Tribal Nation Spotter',
    emoji: '★',
    description: 'Find a tribal nation plate.',
    check: (findings) => {
      const codes = codesOf(findings);
      return BONUS_PLATES.some((p) => p.category === 'United States' && p.label && codes.has(p.code));
    },
  },
  {
    id: 'international',
    name: 'Passport Stamps',
    emoji: '🌐',
    description: 'Find a Canadian province and a Mexican state.',
    check: (findings) => {
      const codes = codesOf(findings);
      const hasCanada = BONUS_PLATES.some((p) => p.category === 'Canada' && codes.has(p.code));
      const hasMexico = BONUS_PLATES.some((p) => p.category === 'Mexico' && codes.has(p.code));
      return hasCanada && hasMexico;
    },
  },
  {
    id: 'canada-sweep',
    name: 'O Canada',
    emoji: '🇨🇦',
    description: 'Find all 13 Canadian provinces and territories.',
    check: (findings) => {
      const codes = codesOf(findings);
      return BONUS_PLATES.filter((p) => p.category === 'Canada').every((p) => codes.has(p.code));
    },
  },
  {
    id: 'mexico-sweep',
    name: 'Viva México',
    emoji: '🇲🇽',
    description: 'Find all 32 Mexican states.',
    check: (findings) => {
      const codes = codesOf(findings);
      return BONUS_PLATES.filter((p) => p.category === 'Mexico').every((p) => codes.has(p.code));
    },
  },
  {
    id: 'capital',
    name: 'Capital Visitor',
    emoji: '🏛️',
    description: 'Find the Washington, D.C. plate.',
    check: (findings) => codesOf(findings).has('DC'),
  },
];

export function getAchievementProgress(findings) {
  return ACHIEVEMENTS.map((a) => ({ ...a, earned: a.check(findings) }));
}
