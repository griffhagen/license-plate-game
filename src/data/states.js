import { STATE_DETAILS } from './stateDetails.js';

function withDetails(state) {
  return { ...state, ...STATE_DETAILS[state.code] };
}

/** All 50 US states with fun facts and road-trip rarity (1–10, higher = harder to spot). */
const STATES_BASE = [
  { code: 'AL', name: 'Alabama', rarity: 5, fact: 'Home to the U.S. Space & Rocket Center in Huntsville.' },
  { code: 'AK', name: 'Alaska', rarity: 9, fact: 'The largest state by area — bigger than Texas, California, and Montana combined.' },
  { code: 'AZ', name: 'Arizona', rarity: 4, fact: 'The Grand Canyon is over a mile deep at its deepest point.' },
  { code: 'AR', name: 'Arkansas', rarity: 5, fact: 'Known as the Natural State for its hot springs and Ozark mountains.' },
  { code: 'CA', name: 'California', rarity: 2, fact: 'If it were a country, its economy would rank among the world\'s largest.' },
  { code: 'CO', name: 'Colorado', rarity: 4, fact: 'Has the highest average elevation of any state.' },
  { code: 'CT', name: 'Connecticut', rarity: 7, fact: 'The Constitution State — the first written constitution in America was drafted here.' },
  { code: 'DE', name: 'Delaware', rarity: 8, fact: 'The first state to ratify the U.S. Constitution in 1787.' },
  { code: 'FL', name: 'Florida', rarity: 3, fact: 'No point in Florida is more than 60 miles from salt water.' },
  { code: 'GA', name: 'Georgia', rarity: 4, fact: 'Produces more peanuts than any other state.' },
  { code: 'HI', name: 'Hawaii', rarity: 10, fact: 'The only U.S. state that grows coffee commercially — the holy grail of plates!' },
  { code: 'ID', name: 'Idaho', rarity: 6, fact: 'Famous for potatoes — about one-third of U.S. potatoes are grown here.' },
  { code: 'IL', name: 'Illinois', rarity: 3, fact: 'Chicago\'s Willis Tower was the tallest building in the world for 25 years.' },
  { code: 'IN', name: 'Indiana', rarity: 4, fact: 'The Indy 500 is the largest single-day sporting event in the world.' },
  { code: 'IA', name: 'Iowa', rarity: 5, fact: 'Leads the nation in corn and pork production.' },
  { code: 'KS', name: 'Kansas', rarity: 5, fact: 'Geographic center of the contiguous United States is in Kansas.' },
  { code: 'KY', name: 'Kentucky', rarity: 4, fact: 'Birthplace of bourbon — 95% of the world\'s bourbon is made here.' },
  { code: 'LA', name: 'Louisiana', rarity: 4, fact: 'New Orleans is below sea level and built on swampland.' },
  { code: 'ME', name: 'Maine', rarity: 3, fact: 'The only state with a one-syllable name — and oddly common on the road!' },
  { code: 'MD', name: 'Maryland', rarity: 5, fact: 'The U.S. national anthem was written during the Battle of Baltimore.' },
  { code: 'MA', name: 'Massachusetts', rarity: 5, fact: 'Harvard, founded in 1636, is the oldest university in the U.S.' },
  { code: 'MI', name: 'Michigan', rarity: 3, fact: 'Has more shoreline than any state except Alaska.' },
  { code: 'MN', name: 'Minnesota', rarity: 5, fact: 'The Land of 10,000 Lakes — actually has over 11,800.' },
  { code: 'MS', name: 'Mississippi', rarity: 5, fact: 'Named after the Mississippi River, the second-longest in North America.' },
  { code: 'MO', name: 'Missouri', rarity: 4, fact: 'The Gateway Arch in St. Louis is the tallest monument in the U.S.' },
  { code: 'MT', name: 'Montana', rarity: 7, fact: 'Big Sky Country — cattle outnumber people here.' },
  { code: 'NE', name: 'Nebraska', rarity: 6, fact: 'Home to the world\'s largest hand-planted forest, Halsey National Forest.' },
  { code: 'NV', name: 'Nevada', rarity: 4, fact: 'About 85% of the state is owned by the federal government.' },
  { code: 'NH', name: 'New Hampshire', rarity: 6, fact: 'The first state to declare independence from England — "Live Free or Die."' },
  { code: 'NJ', name: 'New Jersey', rarity: 5, fact: 'The most densely populated state in the U.S.' },
  { code: 'NM', name: 'New Mexico', rarity: 6, fact: 'Roswell is famous for a 1947 UFO incident that sparked decades of lore.' },
  { code: 'NY', name: 'New York', rarity: 3, fact: 'Niagara Falls moves upstream about one foot per year due to erosion.' },
  { code: 'NC', name: 'North Carolina', rarity: 4, fact: 'Wright brothers made the first powered flight at Kitty Hawk in 1903.' },
  { code: 'ND', name: 'North Dakota', rarity: 7, fact: 'Rugby claims to be the geographic center of North America.' },
  { code: 'OH', name: 'Ohio', rarity: 3, fact: 'More U.S. presidents were born here than any other state (7).' },
  { code: 'OK', name: 'Oklahoma', rarity: 5, fact: 'Has more man-made lakes than any other state.' },
  { code: 'OR', name: 'Oregon', rarity: 5, fact: 'Crater Lake is the deepest lake in the U.S. at 1,943 feet.' },
  { code: 'PA', name: 'Pennsylvania', rarity: 3, fact: 'The Declaration of Independence and Constitution were signed in Philadelphia.' },
  { code: 'RI', name: 'Rhode Island', rarity: 8, fact: 'The smallest state — you can drive across it in about 45 minutes.' },
  { code: 'SC', name: 'South Carolina', rarity: 4, fact: 'Sweet tea is the official hospitality beverage of the state.' },
  { code: 'SD', name: 'South Dakota', rarity: 7, fact: 'Mount Rushmore took 14 years to carve and was never finished as planned.' },
  { code: 'TN', name: 'Tennessee', rarity: 4, fact: 'Nashville is known as Music City — country music\'s capital.' },
  { code: 'TX', name: 'Texas', rarity: 2, fact: 'Could fit 15 of the smallest states inside its borders.' },
  { code: 'UT', name: 'Utah', rarity: 5, fact: 'The Great Salt Lake is saltier than the ocean.' },
  { code: 'VT', name: 'Vermont', rarity: 7, fact: 'Produces more maple syrup than any other state.' },
  { code: 'VA', name: 'Virginia', rarity: 4, fact: 'Eight U.S. presidents were born here — called the Mother of Presidents.' },
  { code: 'WA', name: 'Washington', rarity: 4, fact: 'Produces more apples than any other state.' },
  { code: 'WV', name: 'West Virginia', rarity: 6, fact: 'The only state entirely within the Appalachian Mountains.' },
  { code: 'WI', name: 'Wisconsin', rarity: 4, fact: 'America\'s Dairyland — famous for cheese and the Green Bay Packers.' },
  { code: 'WY', name: 'Wyoming', rarity: 9, fact: 'The least populous state — Yellowstone was the world\'s first national park.' },
];

export const STATES = STATES_BASE.map(withDetails);

export const STATE_BY_CODE = Object.fromEntries(STATES.map((s) => [s.code, s]));
export const TOTAL_STATES = STATES.length;

export function rarityLabel(score) {
  if (score >= 9) return 'Legendary';
  if (score >= 7) return 'Rare';
  if (score >= 5) return 'Uncommon';
  if (score >= 3) return 'Common';
  return 'Everywhere';
}
