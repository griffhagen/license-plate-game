/**
 * Bonus plate image sources from worldlicenseplates.com (Michael Kustermann).
 * Run: npm run bonus-plates
 *
 * Images are cached locally for offline PWA use. See site copyright notice:
 * http://www.worldlicenseplates.com
 */
const WLP = 'http://www.worldlicenseplates.com/jpglps';

export const BONUS_PLATE_SOURCES = {
  CAN: {
    url: `${WLP}/CN_ONTA_SIE.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Ontario, Canada',
  },
  MEX: {
    url: `${WLP}/MX_SONO_GI3.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Sonora, Mexico',
  },
  DC: {
    url: `${WLP}/US_DCXX_GI3.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Washington, D.C.',
  },
  CHR: {
    url: `${WLP}/AI_OKCH_OT-C.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Cherokee Nation',
  },
  NAV: {
    url: `${WLP}/AI_NMNA_NT.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Navajo Nation',
  },
  CHK: {
    url: `${WLP}/AI_OKCK_GI.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Chickasaw Nation',
  },
  CHO: {
    url: `${WLP}/AI_OKCW_GI.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Choctaw Nation',
  },
  MCG: {
    url: `${WLP}/AI_OKMC_GI.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Muscogee (Creek) Nation',
  },
  OSG: {
    url: `${WLP}/AI_OKOS_GI.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Osage Nation',
  },
  SEM: {
    url: `${WLP}/AI_OKSE_GI.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Seminole Nation',
  },
};

export const BONUS_PLATE_CODES = Object.keys(BONUS_PLATE_SOURCES);
