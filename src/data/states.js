import { STATE_DETAILS } from './stateDetails.js';

function withDetails(state) {
  return { ...state, ...STATE_DETAILS[state.code] };
}

/** All 50 US states with fun facts and road-trip rarity (1–10, higher = harder to spot). */
const STATES_BASE = [
  { code: 'AL', name: 'Alabama', rarity: 5, fact: "George Washington Carver, who discovered more than 300 uses for peanuts. The inaugural successful heart transplant operation took place at the University of Alabama in 1967." },
  { code: 'AK', name: 'Alaska', rarity: 9, fact: "The longest coastline in the U.S., 6,640 miles, greater than that of all other states combined. Denali, the highest peak in North America, reaches 20,310 feet above sea level." },
  { code: 'AZ', name: 'Arizona', rarity: 4, fact: "The most telescopes in the world, in Tucson. The Grand Canyon is regarded as one of the world's seven natural wonders." },
  { code: 'AR', name: 'Arkansas', rarity: 5, fact: "The only active diamond mine in the U.S. Hot Springs National Park has served as a natural spa for thousands of years." },
  { code: 'CA', name: 'California', rarity: 2, fact: "“General Sherman,” a 3,500-year-old tree, and a stand of bristlecone pines 4,000 years old are the world's oldest living things. The internationally renowned Silicon Valley — the global hub for technology and innovation." },
  { code: 'CO', name: 'Colorado', rarity: 4, fact: "The world's largest silver nugget (1,840 pounds) found in 1894 near Aspen. The sole state that has refused to host the Winter Olympics (Denver declined the 1976 Winter Games)." },
  { code: 'CT', name: 'Connecticut', rarity: 7, fact: "The first American cookbook, published in Hartford in 1796: American Cookery by Amelia Simmons. Yale University, one of the most esteemed and oldest universities in the U.S., established in 1701." },
  { code: 'DE', name: 'Delaware', rarity: 8, fact: "The first log cabins in North America, built in 1683 by Swedish immigrants. The U.S. Constitution was initially approved in the state, earning it the title “The First State.”" },
  { code: 'FL', name: 'Florida', rarity: 3, fact: "U.S. spacecraft launchings from Cape Canaveral, formerly Cape Kennedy. Walt Disney World — a prominent holiday spot and entertainment center situated in Orlando." },
  { code: 'GA', name: 'Georgia', rarity: 4, fact: "The Girl Scouts, founded in Savannah by Juliette Gordon Low in 1912. Rep. Barbara Lee, a Savannah native and the first African American woman elected to the U.S. Senate." },
  { code: 'HI', name: 'Hawaii', rarity: 10, fact: "The only royal palace in the U.S. (Iolani). The only state composed entirely of islands." },
  { code: 'ID', name: 'Idaho', rarity: 6, fact: "The longest main street in America, 33 miles, in Island Park. The renowned Snake River, celebrated for its turbulent rapids and breathtaking canyon scenery." },
  { code: 'IL', name: 'Illinois', rarity: 3, fact: "The tallest building in the U.S., Sears Tower, in Chicago. The Ice Cream Sundae." },
  { code: 'IN', name: 'Indiana', rarity: 4, fact: "The famous car race: the Indy 500. The Children’s Museum of Indianapolis — the biggest children’s museum in the world." },
  { code: 'IA', name: 'Iowa', rarity: 5, fact: "The shortest and steepest railroad in the U.S., Dubuque: 60° incline, 296 feet. The Iowa Caucus marks the initial significant event in the presidential nomination procedure." },
  { code: 'KS', name: 'Kansas', rarity: 5, fact: "Helium discovered in 1905 at the University of Kansas. The geographic center of the contiguous United States, located near Lebanon, Kansas." },
  { code: 'KY', name: 'Kentucky', rarity: 4, fact: "The largest underground cave in the world: 300 miles long, the Mammoth-Flint Cave system. The Kentucky Derby — a renowned horse race that takes place each year in Louisville." },
  { code: 'LA', name: 'Louisiana', rarity: 4, fact: "The most crayfish: 98% of the world's crayfish. Mardi Gras, a magnificent celebration in New Orleans, renowned for its parades, costumes, and music." },
  { code: 'ME', name: 'Maine', rarity: 3, fact: "The most easterly point in the U.S., West Quoddy Head. Acadia National Park — the inaugural national park located east of the Mississippi River." },
  { code: 'MD', name: 'Maryland', rarity: 5, fact: "The first umbrella factory in the U.S., 1928, Baltimore. The Naval Academy in Annapolis that prepares officers for the United States Navy." },
  { code: 'MA', name: 'Massachusetts', rarity: 5, fact: "The first World Series, 1903: the Boston “Americans” (became the Red Sox in 1908) vs. the Pittsburg Pirates. The Boston Marathon — the oldest annual marathon globally, held each year on Patriots' Day." },
  { code: 'MI', name: 'Michigan', rarity: 3, fact: "The Cereal Bowl of America, Battle Creek, produces most cereal in the U.S. The biggest freshwater sand dune in the world, found in Sleeping Bear Dunes National Lakeshore." },
  { code: 'MN', name: 'Minnesota', rarity: 5, fact: "The oldest rock in the world, 3.8 billion years old, found in the Minnesota River valley. The Mall of America — the biggest shopping center in the U.S." },
  { code: 'MS', name: 'Mississippi', rarity: 5, fact: "Coca-Cola, first bottled in 1894 in Vicksburg. The origin of the blues is found in the Mississippi Delta area, regarded as the “home of the blues.”" },
  { code: 'MO', name: 'Missouri', rarity: 4, fact: "Mark Twain and some of his characters, such as Tom Sawyer and Huckleberry Finn. The Gateway Arch — the highest national monument in the United States." },
  { code: 'MT', name: 'Montana', rarity: 7, fact: "Grasshopper Glacier, named for the grasshoppers that can still be seen frozen in ice. The biggest population of grizzly bears in the U.S., primarily located within the national parks of the state." },
  { code: 'NE', name: 'Nebraska', rarity: 6, fact: "The only roller skating museum in the world, in Lincoln. The Sandhills — an enormous and distinctive terrain of sandy dunes blanketed in grass." },
  { code: 'NV', name: 'Nevada', rarity: 4, fact: "Rare fish such as the Devils Hole pupfish, found only in Devils Hole, and other rare fish from prehistoric lakes; also the driest state. The largest gold-producing state in the U.S., generating more gold than South Africa." },
  { code: 'NH', name: 'New Hampshire', rarity: 6, fact: "Artificial rain, first used near Concord in 1947 to fight a forest fire. The initial major election in the U.S. presidential cycle, which takes place every four years." },
  { code: 'NJ', name: 'New Jersey', rarity: 5, fact: "The world's first drive-in movie theater, built in 1933 near Camden. Atlantic City, famous for its casinos and boardwalk as well as the origin of the contemporary American seaside town." },
  { code: 'NM', name: 'New Mexico', rarity: 6, fact: "“Smokey Bear,” a cub orphaned by fire in 1950, buried in Smokey Bear Historical State Park in 1976. The Carlsbad Caverns — an interconnected system of more than 119 caves created by sulfuric acid." },
  { code: 'NY', name: 'New York', rarity: 3, fact: "The first presidential inauguration: George Washington took the oath of office in New York City on April 30, 1789. The Statue of Liberty, representing freedom and democracy, situated on Liberty Island in New York Harbor." },
  { code: 'NC', name: 'North Carolina', rarity: 4, fact: "Virginia Dare, the first English child born in America, on Roanoke Island in 1587. The initial successful powered flight by the Wright brothers, which occurred at Kitty Hawk in 1903." },
  { code: 'ND', name: 'North Dakota', rarity: 7, fact: "The geographic center of North America, in Pierce County, near Balta. Theodore Roosevelt National Park, dedicated to the 26th U.S. president." },
  { code: 'OH', name: 'Ohio', rarity: 3, fact: "The first electric traffic lights, invented and installed in Cleveland in 1914. The Rock and Roll Hall of Fame, found in Cleveland." },
  { code: 'OK', name: 'Oklahoma', rarity: 5, fact: "The first parking meter, installed in Oklahoma City in 1935. The National Cowboy & Western Heritage Museum, safeguarding the traditions of the American West." },
  { code: 'OR', name: 'Oregon', rarity: 5, fact: "The world's smallest park, totaling 452 inches, created in Portland on St. Patrick's Day for leprechauns and snail races. Crater Lake — the deepest lake in the U.S., formed in a collapsed volcano." },
  { code: 'PA', name: 'Pennsylvania', rarity: 3, fact: "The first magazine in America: the American Magazine, published in Philadelphia for 3 months in 1741. The Liberty Bell — an iconic emblem of American liberty, situated in Philadelphia." },
  { code: 'RI', name: 'Rhode Island', rarity: 8, fact: "Rhode Island Red chickens, first bred in 1854; the start of poultry as a major American industry. The oldest water-themed amusement park in the U.S., situated in Narragansett." },
  { code: 'SC', name: 'South Carolina', rarity: 4, fact: "The first tea farm in the U.S., created in 1890 near Summerville. The oldest water-themed amusement park in the U.S." },
  { code: 'SD', name: 'South Dakota', rarity: 7, fact: "The world's largest natural, indoor warmwater pool, Evans' Plunge in Hot Springs. Mount Rushmore — a national landmark with sculpted faces of four American presidents." },
  { code: 'TN', name: 'Tennessee', rarity: 4, fact: "Graceland, the estate and gravesite of Elvis Presley. The Great Smoky Mountains — a renowned national park with rich biodiversity and misty summits." },
  { code: 'TX', name: 'Texas', rarity: 2, fact: "NASA, in Houston, headquarters for all piloted U.S. space projects. The Alamo — the historic location of a renowned conflict during the Texas Revolution." },
  { code: 'UT', name: 'Utah', rarity: 5, fact: "Rainbow Bridge, the largest natural stone bridge in the world, 290 feet high, 275 feet across. The Great Salt Lake — the biggest saline lake in the Western Hemisphere." },
  { code: 'VT', name: 'Vermont', rarity: 7, fact: "The largest production of maple syrup in the U.S. Ben & Jerry’s Ice Cream, which started in the quaint town of Waterbury." },
  { code: 'VA', name: 'Virginia', rarity: 4, fact: "The only full-length statue of George Washington, placed in the capitol in 1796. Colonial Williamsburg — the historic district highlighting early American culture." },
  { code: 'WA', name: 'Washington', rarity: 4, fact: "Lunar Rover, the vehicle used by astronauts on the moon, and Boeing, in Seattle, makes aircraft and spacecraft. Mount Rainier — a currently active stratovolcano that is the tallest mountain in the state." },
  { code: 'WV', name: 'West Virginia', rarity: 6, fact: "Marbles; most of the country's glass marbles made around Parkersburg. The Appalachian Mountains, famous for their stunning, rugged landscapes and opportunities for outdoor activities." },
  { code: 'WI', name: 'Wisconsin', rarity: 4, fact: "The typewriter, invented in Milwaukee in 1867. The initial contemporary hydraulic jump, developed by engineers in Milwaukee." },
  { code: 'WY', name: 'Wyoming', rarity: 9, fact: "The “Register of the Desert,” a huge granite boulder covering 27 acres with 5,000 early pioneer names carved on it. Yellowstone National Park — the first national park in the world, known for its geothermal features." },
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
