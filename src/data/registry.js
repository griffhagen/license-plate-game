import { STATES, STATE_BY_CODE } from './states.js';
import { BONUS_PLATES, BONUS_BY_CODE } from './bonusPlates.js';

export const PLATE_BY_CODE = { ...STATE_BY_CODE, ...BONUS_BY_CODE };
export const ALL_PLATES = [...STATES, ...BONUS_PLATES];

const VALID_CODES = new Set(ALL_PLATES.map((p) => p.code));

export function normalizePlateCode(raw) {
  return String(raw ?? '')
    .trim()
    .toUpperCase();
}

export function isValidPlateCode(code) {
  return VALID_CODES.has(normalizePlateCode(code));
}

export function isStateCode(code) {
  return Boolean(STATE_BY_CODE[normalizePlateCode(code)]);
}

export function isBonusCode(code) {
  return Boolean(BONUS_BY_CODE[normalizePlateCode(code)]);
}

export function getPlateByCode(code) {
  return PLATE_BY_CODE[normalizePlateCode(code)] ?? null;
}

export function splitFindings(findings) {
  const stateFindings = [];
  const bonusFindings = [];
  for (const f of findings) {
    if (isBonusCode(f.stateCode)) bonusFindings.push(f);
    else if (isStateCode(f.stateCode)) stateFindings.push(f);
    else stateFindings.push(f);
  }
  return { stateFindings, bonusFindings };
}
