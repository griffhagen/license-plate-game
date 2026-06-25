import { STATE_DETAILS } from './stateDetails.js';

function withDetails(state) {
  return { ...state, ...STATE_DETAILS[state.code] };
}

/** All 50 US states with fun facts and road-trip rarity (1–10, higher = harder to spot). */
const STATES_BASE = [
  { code: 'AL', name: 'Alabama', rarity: 5, fact: "Nickname: Heart of Dixie. About 5.2 million people live here (2024 Census estimate). Huntsville is the largest city. Roughly 101.8 people per square mile." },
  { code: 'AK', name: 'Alaska', rarity: 9, fact: "Nickname: Last Frontier. About 740 thousand people live here (2024 Census estimate). Anchorage is the largest city. Roughly 1.3 people per square mile." },
  { code: 'AZ', name: 'Arizona', rarity: 4, fact: "Nickname: Grand Canyon State. About 7.6 million people live here (2024 Census estimate). Phoenix is the largest city. Roughly 66.7 people per square mile." },
  { code: 'AR', name: 'Arkansas', rarity: 5, fact: "Nickname: Natural State. About 3.1 million people live here (2024 Census estimate). Little Rock is the largest city. Roughly 59.4 people per square mile." },
  { code: 'CA', name: 'California', rarity: 2, fact: "Nickname: Golden State. About 39 million people live here (2024 Census estimate). Los Angeles is the largest city. Roughly 253 people per square mile." },
  { code: 'CO', name: 'Colorado', rarity: 4, fact: "Nickname: Centennial State. About 6.0 million people live here (2024 Census estimate). Denver is the largest city. Roughly 57.5 people per square mile." },
  { code: 'CT', name: 'Connecticut', rarity: 7, fact: "Nickname: Constitution State. About 3.7 million people live here (2024 Census estimate). Bridgeport is the largest city. Roughly 758.9 people per square mile." },
  { code: 'DE', name: 'Delaware', rarity: 8, fact: "Nickname: First State. About 1.1 million people live here (2024 Census estimate). Wilmington is the largest city. Roughly 539.8 people per square mile." },
  { code: 'FL', name: 'Florida', rarity: 3, fact: "Nickname: Sunshine State. About 23 million people live here (2024 Census estimate). Jacksonville is the largest city. Roughly 435.6 people per square mile." },
  { code: 'GA', name: 'Georgia', rarity: 4, fact: "Nickname: Peach State. About 11 million people live here (2024 Census estimate). Atlanta is the largest city. Roughly 193.7 people per square mile." },
  { code: 'HI', name: 'Hawaii', rarity: 10, fact: "Nickname: Aloha State. About 1.4 million people live here (2024 Census estimate). Honolulu is the largest city. Roughly 225.2 people per square mile." },
  { code: 'ID', name: 'Idaho', rarity: 6, fact: "Nickname: Gem State. About 2.0 million people live here (2024 Census estimate). Boise is the largest city. Roughly 24.2 people per square mile." },
  { code: 'IL', name: 'Illinois', rarity: 3, fact: "Nickname: Prairie State. About 13 million people live here (2024 Census estimate). Chicago is the largest city. Roughly 229 people per square mile." },
  { code: 'IN', name: 'Indiana', rarity: 4, fact: "Nickname: Hoosier State. About 6.9 million people live here (2024 Census estimate). Indianapolis is the largest city. Roughly 193.3 people per square mile." },
  { code: 'IA', name: 'Iowa', rarity: 5, fact: "Nickname: Hawkeye State. About 3.2 million people live here (2024 Census estimate). Des Moines is the largest city. Roughly 58 people per square mile." },
  { code: 'KS', name: 'Kansas', rarity: 5, fact: "Nickname: Sunflower State. About 3.0 million people live here (2024 Census estimate). Wichita is the largest city. Roughly 36.3 people per square mile." },
  { code: 'KY', name: 'Kentucky', rarity: 4, fact: "Nickname: Bluegrass State. About 4.6 million people live here (2024 Census estimate). Louisville is the largest city. Roughly 116.2 people per square mile." },
  { code: 'LA', name: 'Louisiana', rarity: 4, fact: "Nickname: Pelican State. About 4.6 million people live here (2024 Census estimate). New Orleans is the largest city. Roughly 106.4 people per square mile." },
  { code: 'ME', name: 'Maine', rarity: 3, fact: "Nickname: Pine Tree State. About 1.4 million people live here (2024 Census estimate). Portland is the largest city. Roughly 45.6 people per square mile." },
  { code: 'MD', name: 'Maryland', rarity: 5, fact: "Nickname: Old Line State. About 6.3 million people live here (2024 Census estimate). Baltimore is the largest city. Roughly 645 people per square mile." },
  { code: 'MA', name: 'Massachusetts', rarity: 5, fact: "Nickname: Bay State. About 7.1 million people live here (2024 Census estimate). Boston is the largest city. Roughly 914.8 people per square mile." },
  { code: 'MI', name: 'Michigan', rarity: 3, fact: "Nickname: Great Lakes State. About 10 million people live here (2024 Census estimate). Detroit is the largest city. Roughly 179.1 people per square mile." },
  { code: 'MN', name: 'Minnesota', rarity: 5, fact: "Nickname: Land of 10,000 Lakes. About 5.8 million people live here (2024 Census estimate). Minneapolis is the largest city. Roughly 72.7 people per square mile." },
  { code: 'MS', name: 'Mississippi', rarity: 5, fact: "Nickname: Magnolia State. About 2.9 million people live here (2024 Census estimate). Jackson is the largest city. Roughly 62.7 people per square mile." },
  { code: 'MO', name: 'Missouri', rarity: 4, fact: "Nickname: Show Me State. About 6.2 million people live here (2024 Census estimate). Kansas City is the largest city. Roughly 90.8 people per square mile." },
  { code: 'MT', name: 'Montana', rarity: 7, fact: "Nickname: Treasure State. About 1.1 million people live here (2024 Census estimate). Billings is the largest city. Roughly 7.8 people per square mile." },
  { code: 'NE', name: 'Nebraska', rarity: 6, fact: "Nickname: Cornhusker State. About 2.0 million people live here (2024 Census estimate). Omaha is the largest city. Roughly 26.1 people per square mile." },
  { code: 'NV', name: 'Nevada', rarity: 4, fact: "Nickname: Silver State. About 3.3 million people live here (2024 Census estimate). Las Vegas is the largest city. Roughly 29.7 people per square mile." },
  { code: 'NH', name: 'New Hampshire', rarity: 6, fact: "Nickname: Granite State. About 1.4 million people live here (2024 Census estimate). Manchester is the largest city. Roughly 157.4 people per square mile." },
  { code: 'NJ', name: 'New Jersey', rarity: 5, fact: "Nickname: Garden State. About 9.5 million people live here (2024 Census estimate). Newark is the largest city. Roughly 1 people per square mile." },
  { code: 'NM', name: 'New Mexico', rarity: 6, fact: "Nickname: The Land of Enchantment. About 2.1 million people live here (2024 Census estimate). Albuquerque is the largest city. Roughly 17.6 people per square mile." },
  { code: 'NY', name: 'New York', rarity: 3, fact: "Nickname: Empire State. About 20 million people live here (2024 Census estimate). New York is the largest city. Roughly 421.6 people per square mile." },
  { code: 'NC', name: 'North Carolina', rarity: 4, fact: "Nickname: Tar Heel State. About 11 million people live here (2024 Census estimate). Charlotte is the largest city. Roughly 227.2 people per square mile." },
  { code: 'ND', name: 'North Dakota', rarity: 7, fact: "Nickname: Peace Garden State. About 797 thousand people live here (2024 Census estimate). Fargo is the largest city. Roughly 11.5 people per square mile." },
  { code: 'OH', name: 'Ohio', rarity: 3, fact: "Nickname: Buckeye State. About 12 million people live here (2024 Census estimate). Columbus is the largest city. Roughly 290.8 people per square mile." },
  { code: 'OK', name: 'Oklahoma', rarity: 5, fact: "Nickname: Sooner State. About 4.1 million people live here (2024 Census estimate). Oklahoma City is the largest city. Roughly 59.7 people per square mile." },
  { code: 'OR', name: 'Oregon', rarity: 5, fact: "Nickname: Beaver State. About 4.3 million people live here (2024 Census estimate). Portland is the largest city. Roughly 44.5 people per square mile." },
  { code: 'PA', name: 'Pennsylvania', rarity: 3, fact: "Nickname: Keystone State. About 13 million people live here (2024 Census estimate). Philadelphia is the largest city. Roughly 292.3 people per square mile." },
  { code: 'RI', name: 'Rhode Island', rarity: 8, fact: "Nickname: Ocean State. About 1.1 million people live here (2024 Census estimate). Providence is the largest city. Roughly 1 people per square mile." },
  { code: 'SC', name: 'South Carolina', rarity: 4, fact: "Nickname: Palmetto State. About 5.5 million people live here (2024 Census estimate). Charleston is the largest city. Roughly 182.2 people per square mile." },
  { code: 'SD', name: 'South Dakota', rarity: 7, fact: "Nickname: Mount Rushmore State. About 925 thousand people live here (2024 Census estimate). Sioux Falls is the largest city. Roughly 12.2 people per square mile." },
  { code: 'TN', name: 'Tennessee', rarity: 4, fact: "Nickname: Volunteer State. About 7.2 million people live here (2024 Census estimate). Nashville is the largest city. Roughly 175.3 people per square mile." },
  { code: 'TX', name: 'Texas', rarity: 2, fact: "Nickname: Lone Star State. About 31 million people live here (2024 Census estimate). Houston is the largest city. Roughly 119.8 people per square mile." },
  { code: 'UT', name: 'Utah', rarity: 5, fact: "Nickname: Beehive State. About 3.5 million people live here (2024 Census estimate). Salt Lake City is the largest city. Roughly 42.4 people per square mile." },
  { code: 'VT', name: 'Vermont', rarity: 7, fact: "Nickname: Green Mountain State. About 648 thousand people live here (2024 Census estimate). Burlington is the largest city. Roughly 70.4 people per square mile." },
  { code: 'VA', name: 'Virginia', rarity: 4, fact: "Nickname: Old Dominion. About 8.8 million people live here (2024 Census estimate). Virginia Beach is the largest city. Roughly 223.2 people per square mile." },
  { code: 'WA', name: 'Washington', rarity: 4, fact: "Nickname: Evergreen State. About 8.0 million people live here (2024 Census estimate). Seattle is the largest city. Roughly 119.8 people per square mile." },
  { code: 'WV', name: 'West Virginia', rarity: 6, fact: "Nickname: Mountain State. About 1.8 million people live here (2024 Census estimate). Charleston is the largest city. Roughly 73.6 people per square mile." },
  { code: 'WI', name: 'Wisconsin', rarity: 4, fact: "Nickname: America's Dairyland. About 6.0 million people live here (2024 Census estimate). Milwaukee is the largest city. Roughly 110 people per square mile." },
  { code: 'WY', name: 'Wyoming', rarity: 9, fact: "Nickname: Cowboy State. About 588 thousand people live here (2024 Census estimate). Cheyenne is the largest city. Roughly 6.1 people per square mile." },
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
