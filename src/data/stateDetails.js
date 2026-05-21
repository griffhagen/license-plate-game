/** Capital, population (~2024 est.), and official symbols. */
export const STATE_DETAILS = {
  AL: { capital: 'Montgomery', population: 5100000, bird: 'Yellowhammer', animal: 'Black Bear' },
  AK: { capital: 'Juneau', population: 737000, bird: 'Willow Ptarmigan', animal: 'Moose' },
  AZ: { capital: 'Phoenix', population: 7430000, bird: 'Cactus Wren', animal: 'Ringtail Cat' },
  AR: { capital: 'Little Rock', population: 3060000, bird: 'Mockingbird', animal: 'White-tailed Deer' },
  CA: { capital: 'Sacramento', population: 38900000, bird: 'California Quail', animal: 'California Grizzly Bear' },
  CO: { capital: 'Denver', population: 5870000, bird: 'Lark Bunting', animal: 'Rocky Mountain Bighorn Sheep' },
  CT: { capital: 'Hartford', population: 3610000, bird: 'American Robin', animal: 'Sperm Whale' },
  DE: { capital: 'Dover', population: 1030000, bird: 'Blue Hen Chicken', animal: 'Gray Fox' },
  FL: { capital: 'Tallahassee', population: 22600000, bird: 'Mockingbird', animal: 'Florida Panther' },
  GA: { capital: 'Atlanta', population: 11000000, bird: 'Brown Thrasher', animal: 'White-tailed Deer' },
  HI: { capital: 'Honolulu', population: 1440000, bird: 'Nene (Hawaiian Goose)', animal: 'Hawaiian Monk Seal' },
  ID: { capital: 'Boise', population: 1960000, bird: 'Mountain Bluebird', animal: 'Appaloosa Horse' },
  IL: { capital: 'Springfield', population: 12580000, bird: 'Northern Cardinal', animal: 'White-tailed Deer' },
  IN: { capital: 'Indianapolis', population: 6860000, bird: 'Northern Cardinal', animal: 'White-tailed Deer' },
  IA: { capital: 'Des Moines', population: 3200000, bird: 'American Goldfinch', animal: 'White-tailed Deer' },
  KS: { capital: 'Topeka', population: 2940000, bird: 'Western Meadowlark', animal: 'American Buffalo' },
  KY: { capital: 'Frankfort', population: 4510000, bird: 'Northern Cardinal', animal: 'Gray Squirrel' },
  LA: { capital: 'Baton Rouge', population: 4650000, bird: 'Brown Pelican', animal: 'Black Bear' },
  ME: { capital: 'Augusta', population: 1390000, bird: 'Black-capped Chickadee', animal: 'Moose' },
  MD: { capital: 'Annapolis', population: 6180000, bird: 'Baltimore Oriole', animal: 'Thoroughbred Horse' },
  MA: { capital: 'Boston', population: 7000000, bird: 'Black-capped Chickadee', animal: 'Boston Terrier' },
  MI: { capital: 'Lansing', population: 10040000, bird: 'American Robin', animal: 'White-tailed Deer' },
  MN: { capital: 'Saint Paul', population: 5730000, bird: 'Common Loon', animal: 'White-tailed Deer' },
  MS: { capital: 'Jackson', population: 2940000, bird: 'Mockingbird', animal: 'White-tailed Deer' },
  MO: { capital: 'Jefferson City', population: 6190000, bird: 'Eastern Bluebird', animal: 'Missouri Mule' },
  MT: { capital: 'Helena', population: 1130000, bird: 'Western Meadowlark', animal: 'Grizzly Bear' },
  NE: { capital: 'Lincoln', population: 1970000, bird: 'Western Meadowlark', animal: 'White-tailed Deer' },
  NV: { capital: 'Carson City', population: 3190000, bird: 'Mountain Bluebird', animal: 'Desert Bighorn Sheep' },
  NH: { capital: 'Concord', population: 1400000, bird: 'Purple Finch', animal: 'White-tailed Deer' },
  NJ: { capital: 'Trenton', population: 9290000, bird: 'Eastern Goldfinch', animal: 'Horse' },
  NM: { capital: 'Santa Fe', population: 2110000, bird: 'Greater Roadrunner', animal: 'Black Bear' },
  NY: { capital: 'Albany', population: 19630000, bird: 'Eastern Bluebird', animal: 'Beaver' },
  NC: { capital: 'Raleigh', population: 10700000, bird: 'Northern Cardinal', animal: 'Gray Squirrel' },
  ND: { capital: 'Bismarck', population: 783000, bird: 'Western Meadowlark', animal: 'Nokota Horse' },
  OH: { capital: 'Columbus', population: 11790000, bird: 'Northern Cardinal', animal: 'White-tailed Deer' },
  OK: { capital: 'Oklahoma City', population: 4010000, bird: 'Scissor-tailed Flycatcher', animal: 'American Buffalo' },
  OR: { capital: 'Salem', population: 4230000, bird: 'Western Meadowlark', animal: 'Beaver' },
  PA: { capital: 'Harrisburg', population: 12990000, bird: 'Ruffed Grouse', animal: 'White-tailed Deer' },
  RI: { capital: 'Providence', population: 1090000, bird: 'Rhode Island Red Chicken', animal: 'Harbor Seal' },
  SC: { capital: 'Columbia', population: 5280000, bird: 'Carolina Wren', animal: 'White-tailed Deer' },
  SD: { capital: 'Pierre', population: 919000, bird: 'Ring-necked Pheasant', animal: 'Coyote' },
  TN: { capital: 'Nashville', population: 7120000, bird: 'Northern Mockingbird', animal: 'Raccoon' },
  TX: { capital: 'Austin', population: 30500000, bird: 'Northern Mockingbird', animal: 'Nine-banded Armadillo' },
  UT: { capital: 'Salt Lake City', population: 3380000, bird: 'California Gull', animal: 'Rocky Mountain Elk' },
  VT: { capital: 'Montpelier', population: 647000, bird: 'Hermit Thrush', animal: 'Morgan Horse' },
  VA: { capital: 'Richmond', population: 8640000, bird: 'Northern Cardinal', animal: 'American Foxhound' },
  WA: { capital: 'Olympia', population: 7810000, bird: 'American Goldfinch', animal: 'Olympic Marmot' },
  WV: { capital: 'Charleston', population: 1770000, bird: 'Northern Cardinal', animal: 'Black Bear' },
  WI: { capital: 'Madison', population: 5890000, bird: 'American Robin', animal: 'White-tailed Deer' },
  WY: { capital: 'Cheyenne', population: 584000, bird: 'Western Meadowlark', animal: 'American Buffalo' },
};

export function formatPopulation(n) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 10 ? `${Math.round(m)} million` : `${m.toFixed(1)} million`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)} thousand`;
  return String(n);
}
