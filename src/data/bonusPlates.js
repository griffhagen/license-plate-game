import { BONUS_DETAILS } from './bonusDetails.js';

function withDetails(plate) {
  return { ...plate, bonus: true, ...BONUS_DETAILS[plate.code] };
}

/** Bonus plates — tracked separately from the 50 US states. */
const BONUS_BASE = [
  {
    code: 'CAN',
    name: 'Canada',
    rarity: 8,
    emoji: '🇨🇦',
    fact: 'Canadian plates use a province code (e.g. Ontario, British Columbia) — a fun spot on border-state road trips.',
  },
  {
    code: 'MEX',
    name: 'Mexico',
    rarity: 9,
    emoji: '🇲🇽',
    fact: 'Mexican plates often show the state name along the bottom — common near the southern border.',
  },
  {
    code: 'DC',
    name: 'Washington, D.C.',
    rarity: 7,
    emoji: '🏛️',
    fact: 'D.C. plates read “Taxation Without Representation” — the district is not a state.',
  },
  {
    code: 'CHR',
    name: 'Cherokee Nation',
    rarity: 9,
    emoji: '★',
    fact: 'The Cherokee Nation issues its own tribal plate to citizens in Oklahoma.',
  },
  {
    code: 'NAV',
    name: 'Navajo Nation',
    rarity: 9,
    emoji: '★',
    fact: 'One of the largest tribal plates in the U.S. — seen across Arizona, New Mexico, and Utah.',
  },
  {
    code: 'CHK',
    name: 'Chickasaw Nation',
    rarity: 10,
    emoji: '★',
    fact: 'Chickasaw Nation plates feature tribal seal artwork and are issued in Oklahoma.',
  },
  {
    code: 'CHO',
    name: 'Choctaw Nation',
    rarity: 10,
    emoji: '★',
    fact: 'The Choctaw Nation offers distinctive plates to tribal citizens in southeastern Oklahoma.',
  },
  {
    code: 'MCG',
    name: 'Muscogee (Creek) Nation',
    rarity: 10,
    emoji: '★',
    fact: 'Muscogee Nation plates are issued to citizens — a rare find outside Oklahoma.',
  },
  {
    code: 'OSG',
    name: 'Osage Nation',
    rarity: 10,
    emoji: '★',
    fact: 'Osage Nation tribal plates are most often spotted in northeastern Oklahoma.',
  },
  {
    code: 'SEM',
    name: 'Seminole Nation',
    rarity: 10,
    emoji: '★',
    fact: 'Seminole Nation of Oklahoma issues plates to enrolled citizens.',
  },
];

export const BONUS_PLATES = BONUS_BASE.map(withDetails);
export const BONUS_BY_CODE = Object.fromEntries(BONUS_PLATES.map((p) => [p.code, p]));
export const TOTAL_BONUS = BONUS_PLATES.length;
