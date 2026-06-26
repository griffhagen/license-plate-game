/** Extra facts for bonus plates (capital, population, symbols where they apply). */
const CANADA_REGIONS = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
const MEXICO_REGIONS = [
  'AGU', 'BCN', 'BCS', 'CAM', 'CHH', 'CHP', 'CMX', 'COA', 'COL', 'DUR', 'GRO', 'GUA',
  'HID', 'JAL', 'MEX', 'MIC', 'MOR', 'NAY', 'NLE', 'OAX', 'PUE', 'QUE', 'ROO', 'SIN',
  'SLP', 'SON', 'TAB', 'TAM', 'TLA', 'VER', 'YUC', 'ZAC',
];

export const BONUS_DETAILS = {
  ...Object.fromEntries(CANADA_REGIONS.map((c) => [c, { region: 'Canada', label: 'Canadian province plate' }])),
  ...Object.fromEntries(MEXICO_REGIONS.map((c) => [c, { region: 'Mexico', label: 'Mexican state plate' }])),
  DC: {
    capital: 'Washington',
    population: 670000,
    bird: 'Wood Thrush',
    animal: 'American Bison',
    region: 'Mid-Atlantic',
  },
  CHR: { region: 'Oklahoma', population: 430000, label: 'Tribal nation plate' },
  NAV: { region: 'AZ · NM · UT', population: 170000, label: 'Tribal nation plate' },
  CHK: { region: 'Oklahoma', population: 75000, label: 'Tribal nation plate' },
  CHO: { region: 'Oklahoma', population: 200000, label: 'Tribal nation plate' },
  MCG: { region: 'Oklahoma', population: 90000, label: 'Tribal nation plate' },
  OSG: { region: 'Oklahoma', population: 20000, label: 'Tribal nation plate' },
  SEM: { region: 'Oklahoma', population: 19000, label: 'Tribal nation plate' },
};
