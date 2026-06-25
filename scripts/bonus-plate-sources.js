/**
 * Bonus plate display images — single-plate photos only (Wikimedia Commons or
 * worldlicenseplates.com _OT/_NT files). Run: npm run bonus-plates
 *
 * Plate history / variations: see src/data/plateReferenceLinks.js (WLP pages).
 */
const WLP = 'http://www.worldlicenseplates.com/jpglps';

export const BONUS_PLATE_SOURCES = {
  CAN: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Ontario_license_plate_-_QJQQJQ.jpg',
    ext: 'jpg',
    credit: 'Wikimedia Commons — Ontario passenger plate',
  },
  MEX: {
    url: `${WLP}/MX_SONO_GI3.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Sonora, Mexico (display); see WLP for variations',
  },
  DC: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Washington%2C_D.C._license_plate%2C_2017.png',
    ext: 'png',
    credit: 'Wikimedia Commons — Washington, D.C. plate',
  },
  CHR: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Cherokee_Nation_of_Oklahoma_license_plate.JPG',
    ext: 'jpg',
    credit: 'Wikimedia Commons — Cherokee Nation plate',
  },
  NAV: {
    url: `${WLP}/AI_NMNA_NT.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Navajo Nation (single plate)',
  },
  CHK: {
    url: `${WLP}/AI_OKCK_OT.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Chickasaw Nation (single plate)',
  },
  CHO: {
    url: `${WLP}/AI_OKCW_OT.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Choctaw Nation (single plate)',
  },
  MCG: {
    url: `${WLP}/AI_OKMC_OT-C.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Muscogee (Creek) Nation (single plate)',
  },
  OSG: {
    url: `${WLP}/AI_OKOS_OT.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Osage Nation (single plate)',
  },
  SEM: {
    url: `${WLP}/AI_OKSE_OT-M.jpg`,
    ext: 'jpg',
    credit: 'worldlicenseplates.com — Seminole Nation (single plate)',
  },
};

export const BONUS_PLATE_CODES = Object.keys(BONUS_PLATE_SOURCES);
