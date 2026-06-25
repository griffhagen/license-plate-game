/** worldlicenseplates.com pages for browsing plate variations (Michael Kustermann). */
const WLP = 'http://www.worldlicenseplates.com';

/** @type {Record<string, string>} */
export const WLP_STATE_PAGES = {
  AL: `${WLP}/usa/US_ALXX.html`,
  AK: `${WLP}/usa/US_AKXX.html`,
  AZ: `${WLP}/usa/US_AZXX.html`,
  AR: `${WLP}/usa/US_ARXX.html`,
  CA: `${WLP}/usa/US_CAXX.html`,
  CO: `${WLP}/usa/US_COXX.html`,
  CT: `${WLP}/usa/US_CTXX.html`,
  DE: `${WLP}/usa/US_DEXX.html`,
  FL: `${WLP}/usa/US_FLXX.html`,
  GA: `${WLP}/usa/US_GAXX.html`,
  HI: `${WLP}/usa/US_HIXX.html`,
  ID: `${WLP}/usa/US_IDXX.html`,
  IL: `${WLP}/usa/US_ILXX.html`,
  IN: `${WLP}/usa/US_INXX.html`,
  IA: `${WLP}/usa/US_IAXX.html`,
  KS: `${WLP}/usa/US_KSXX.html`,
  KY: `${WLP}/usa/US_KYXX.html`,
  LA: `${WLP}/usa/US_LAXX.html`,
  ME: `${WLP}/usa/US_MEXX.html`,
  MD: `${WLP}/usa/US_MDXX.html`,
  MA: `${WLP}/usa/US_MAXX.html`,
  MI: `${WLP}/usa/US_MIXX.html`,
  MN: `${WLP}/usa/US_MNXX.html`,
  MS: `${WLP}/usa/US_MSXX.html`,
  MO: `${WLP}/usa/US_MOXX.html`,
  MT: `${WLP}/usa/US_MTXX.html`,
  NE: `${WLP}/usa/US_NEXX.html`,
  NV: `${WLP}/usa/US_NVXX.html`,
  NH: `${WLP}/usa/US_NHXX.html`,
  NJ: `${WLP}/usa/US_NJXX.html`,
  NM: `${WLP}/usa/US_NMXX.html`,
  NY: `${WLP}/usa/US_NYXX.html`,
  NC: `${WLP}/usa/US_NCXX.html`,
  ND: `${WLP}/usa/US_NDXX.html`,
  OH: `${WLP}/usa/US_OHXX.html`,
  OK: `${WLP}/usa/US_OKXX.html`,
  OR: `${WLP}/usa/US_ORXX.html`,
  PA: `${WLP}/usa/US_PAXX.html`,
  RI: `${WLP}/usa/US_RIXX.html`,
  SC: `${WLP}/usa/US_SCXX.html`,
  SD: `${WLP}/usa/US_SDXX.html`,
  TN: `${WLP}/usa/US_TNXX.html`,
  TX: `${WLP}/usa/US_TXXX.html`,
  UT: `${WLP}/usa/US_UTXX.html`,
  VT: `${WLP}/usa/US_VTXX.html`,
  VA: `${WLP}/usa/US_VAXX.html`,
  WA: `${WLP}/usa/US_WAXX.html`,
  WV: `${WLP}/usa/US_WVXX.html`,
  WI: `${WLP}/usa/US_WIXX.html`,
  WY: `${WLP}/usa/US_WYXX.html`,
};

/** @type {Record<string, string>} */
export const WLP_BONUS_PAGES = {
  CAN: `${WLP}/world/CN_ONTA.html`,
  MEX: `${WLP}/world/MX_SONO.html`,
  DC: `${WLP}/usa/US_DCXX.html`,
  CHR: `${WLP}/usa/AI_OKCH.html`,
  NAV: `${WLP}/usa/AI_NMNA.html`,
  CHK: `${WLP}/usa/AI_OKCK.html`,
  CHO: `${WLP}/usa/AI_OKCW.html`,
  MCG: `${WLP}/usa/AI_OKMC.html`,
  OSG: `${WLP}/usa/AI_OKOS.html`,
  SEM: `${WLP}/usa/AI_OKSE.html`,
};

export function getPlateReferenceUrl(code) {
  return WLP_STATE_PAGES[code] ?? WLP_BONUS_PAGES[code] ?? null;
}
