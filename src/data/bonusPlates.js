import { BONUS_DETAILS } from './bonusDetails.js';

function withDetails(plate) {
  return { ...plate, bonus: true, ...BONUS_DETAILS[plate.code] };
}

/** Canadian provinces — each tracked as its own bonus plate. */
const CANADA_BASE = [
  { code: 'ON', name: 'Ontario', rarity: 5, fact: 'Ontario plates carry the slogan "Yours to Discover" and are Canada\'s most populous province plate.' },
  { code: 'QC', name: 'Quebec', rarity: 6, fact: 'Quebec plates read "Je me souviens" ("I remember") and are issued in French.' },
  { code: 'BC', name: 'British Columbia', rarity: 5, fact: 'British Columbia plates are common along the Pacific Northwest border crossings.' },
  { code: 'AB', name: 'Alberta', rarity: 6, fact: 'Alberta plates are a common sight near the Montana and northern border crossings.' },
  { code: 'MB', name: 'Manitoba', rarity: 7, fact: 'Manitoba plates are spotted less often outside the northern Midwest.' },
  { code: 'SK', name: 'Saskatchewan', rarity: 7, fact: 'Saskatchewan plates show the provincial coat of arms with wheat sheaves.' },
  { code: 'NS', name: 'Nova Scotia', rarity: 8, fact: 'Nova Scotia plates feature the provincial bird, the osprey.' },
  { code: 'NB', name: 'New Brunswick', rarity: 8, fact: 'New Brunswick is Canada\'s only officially bilingual province, and its plates reflect that.' },
  { code: 'PE', name: 'Prince Edward Island', rarity: 9, fact: 'P.E.I. plates are a rare find far from the Maritimes.' },
  { code: 'NL', name: 'Newfoundland/Labrador', rarity: 9, fact: 'Newfoundland and Labrador plates are uncommon outside Atlantic Canada.' },
  { code: 'YT', name: 'Yukon', rarity: 10, fact: 'Yukon plates are shaped like a polar bear silhouette — one of the most distinctive in North America.' },
  { code: 'NT', name: 'Northwest Territories', rarity: 10, fact: 'Northwest Territories plates are also shaped like a polar bear.' },
  { code: 'NU', name: 'Nunavut', rarity: 10, fact: 'Nunavut, Canada\'s newest and northernmost territory, has one of the rarest plates to spot.' },
];

/** Mexican states — each tracked as its own bonus plate. */
const MEXICO_BASE = [
  { code: 'BCN', name: 'Baja California', rarity: 4, fact: 'Baja California plates are a common sight near the California border crossings.' },
  { code: 'SON', name: 'Sonora', rarity: 4, fact: 'Sonora plates are frequently seen near the Arizona border.' },
  { code: 'CHH', name: 'Chihuahua', rarity: 4, fact: 'Chihuahua is Mexico\'s largest state by area, bordering Texas and New Mexico.' },
  { code: 'COA', name: 'Coahuila', rarity: 5, fact: 'Coahuila plates are common near the Texas border crossings around Laredo and Eagle Pass.' },
  { code: 'NLE', name: 'Nuevo Leon', rarity: 5, fact: 'Nuevo Leon, home to Monterrey, is one of Mexico\'s most industrial states.' },
  { code: 'TAM', name: 'Tamaulipas', rarity: 5, fact: 'Tamaulipas plates are common near the Texas border crossings around Brownsville and McAllen.' },
  { code: 'BCS', name: 'Baja California Sur', rarity: 6, fact: 'Baja California Sur plates are less common outside the Baja peninsula.' },
  { code: 'JAL', name: 'Jalisco', rarity: 6, fact: 'Jalisco, home to Guadalajara, is the birthplace of mariachi music and tequila.' },
  { code: 'CMX', name: 'CDMX (Mex. City)', rarity: 6, fact: 'CDMX plates come from Mexico\'s capital and most populous city.' },
  { code: 'GUA', name: 'Guanajuato', rarity: 6, fact: 'Guanajuato is known for its colorful colonial-era cities.' },
  { code: 'MEX', name: 'Mexico (state)', rarity: 6, fact: 'The State of Mexico surrounds Mexico City and is the country\'s most populous state.' },
  { code: 'AGU', name: 'Aguascalientes', rarity: 8, fact: 'Aguascalientes is one of Mexico\'s smallest states by area.' },
  { code: 'CAM', name: 'Campeche', rarity: 8, fact: 'Campeche plates are a rare find outside the Yucatan peninsula.' },
  { code: 'CHP', name: 'Chiapas', rarity: 8, fact: 'Chiapas, Mexico\'s southernmost state, borders Guatemala.' },
  { code: 'COL', name: 'Colima', rarity: 8, fact: 'Colima is one of Mexico\'s smallest and least populous states.' },
  { code: 'DUR', name: 'Durango', rarity: 8, fact: 'Durango is famous as a filming location for classic Western movies.' },
  { code: 'GRO', name: 'Guerrero', rarity: 8, fact: 'Guerrero is home to the resort city of Acapulco.' },
  { code: 'HID', name: 'Hidalgo', rarity: 8, fact: 'Hidalgo is named after independence hero Miguel Hidalgo.' },
  { code: 'MIC', name: 'Michoacán', rarity: 8, fact: 'Michoacán is the winter home of millions of migrating monarch butterflies.' },
  { code: 'MOR', name: 'Morelos', rarity: 8, fact: 'Morelos is one of Mexico\'s smallest states, located just south of Mexico City.' },
  { code: 'NAY', name: 'Nayarit', rarity: 8, fact: 'Nayarit plates are a rare find along Mexico\'s central Pacific coast.' },
  { code: 'OAX', name: 'Oaxaca', rarity: 8, fact: 'Oaxaca is known for its rich indigenous cultures and cuisine.' },
  { code: 'PUE', name: 'Puebla', rarity: 8, fact: 'Puebla is famous for mole poblano and Talavera pottery.' },
  { code: 'QUE', name: 'Queretaro', rarity: 8, fact: 'Queretaro plates are uncommon outside central Mexico.' },
  { code: 'ROO', name: 'Quintana Roo', rarity: 8, fact: 'Quintana Roo is home to Cancun and the Riviera Maya.' },
  { code: 'SIN', name: 'Sinaloa', rarity: 8, fact: 'Sinaloa plates are a rare find along the U.S.–Mexico border region.' },
  { code: 'SLP', name: 'San Luis Potosi', rarity: 8, fact: 'San Luis Potosi sits at a historic crossroads of central Mexico.' },
  { code: 'TAB', name: 'Tabasco', rarity: 8, fact: 'Tabasco, on the Gulf coast, lends its name to the famous hot sauce.' },
  { code: 'TLA', name: 'Tlaxcala', rarity: 9, fact: 'Tlaxcala is Mexico\'s smallest state by area.' },
  { code: 'VER', name: 'Veracruz', rarity: 8, fact: 'Veracruz is Mexico\'s main Gulf coast port state.' },
  { code: 'YUC', name: 'Yucatan', rarity: 8, fact: 'Yucatan plates are a rare find outside the Yucatan peninsula.' },
  { code: 'ZAC', name: 'Zacatecas', rarity: 8, fact: 'Zacatecas is known for its colonial silver-mining history.' },
];

/** Bonus plates — tracked separately from the 50 US states. */
const BONUS_BASE = [
  ...CANADA_BASE.map((p) => ({ ...p, emoji: '🇨🇦', category: 'Canadian provinces' })),
  ...MEXICO_BASE.map((p) => ({ ...p, emoji: '🇲🇽', category: 'Mexican states' })),
  {
    code: 'DC',
    name: 'Washington, D.C.',
    rarity: 7,
    emoji: '🏛️',
    category: 'Capital district',
    fact: 'D.C. plates read “Taxation Without Representation” — the district is not a state.',
  },
  {
    code: 'CHR',
    name: 'Cherokee Nation',
    rarity: 9,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'The Cherokee Nation issues its own tribal plate to citizens in Oklahoma.',
  },
  {
    code: 'NAV',
    name: 'Navajo Nation',
    rarity: 9,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'One of the largest tribal plates in the U.S. — seen across Arizona, New Mexico, and Utah.',
  },
  {
    code: 'CHK',
    name: 'Chickasaw Nation',
    rarity: 10,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'Chickasaw Nation plates feature tribal seal artwork and are issued in Oklahoma.',
  },
  {
    code: 'CHO',
    name: 'Choctaw Nation',
    rarity: 10,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'The Choctaw Nation offers distinctive plates to tribal citizens in southeastern Oklahoma.',
  },
  {
    code: 'MCG',
    name: 'Muscogee (Creek) Nation',
    rarity: 10,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'Muscogee Nation plates are issued to citizens — a rare find outside Oklahoma.',
  },
  {
    code: 'OSG',
    name: 'Osage Nation',
    rarity: 10,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'Osage Nation tribal plates are most often spotted in northeastern Oklahoma.',
  },
  {
    code: 'SEM',
    name: 'Seminole Nation',
    rarity: 10,
    emoji: '★',
    category: 'Tribal nations',
    fact: 'Seminole Nation of Oklahoma issues plates to enrolled citizens.',
  },
];

export const BONUS_PLATES = BONUS_BASE.map(withDetails);
export const BONUS_BY_CODE = Object.fromEntries(BONUS_PLATES.map((p) => [p.code, p]));
export const TOTAL_BONUS = BONUS_PLATES.length;
