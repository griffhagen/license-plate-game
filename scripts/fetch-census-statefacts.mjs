#!/usr/bin/env node
/**
 * Pull kid-friendly state facts from Census State Facts for Students and update
 * src/data/stateDetails.js + src/data/states.js fact strings.
 * https://www.census.gov/schools/statefacts/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const UA = 'LicensePlateGame/1.0 (educational; census state facts cache)';

const STATE_SLUGS = {
  AL: 'alabama', AK: 'alaska', AZ: 'arizona', AR: 'arkansas', CA: 'california',
  CO: 'colorado', CT: 'connecticut', DE: 'delaware', FL: 'florida', GA: 'georgia',
  HI: 'hawaii', ID: 'idaho', IL: 'illinois', IN: 'indiana', IA: 'iowa',
  KS: 'kansas', KY: 'kentucky', LA: 'louisiana', ME: 'maine', MD: 'maryland',
  MA: 'massachusetts', MI: 'michigan', MN: 'minnesota', MS: 'mississippi', MO: 'missouri',
  MT: 'montana', NE: 'nebraska', NV: 'nevada', NH: 'new_hampshire', NJ: 'new_jersey',
  NM: 'new_mexico', NY: 'new_york', NC: 'north_carolina', ND: 'north_dakota', OH: 'ohio',
  OK: 'oklahoma', OR: 'oregon', PA: 'pennsylvania', RI: 'rhode_island', SC: 'south_carolina',
  SD: 'south_dakota', TN: 'tennessee', TX: 'texas', UT: 'utah', VT: 'vermont',
  VA: 'virginia', WA: 'washington', WV: 'west_virginia', WI: 'wisconsin', WY: 'wyoming',
};

function parsePopulation(text) {
  const n = Number(String(text).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function cellAfter(html, label) {
  const re = new RegExp(
    `<td[^>]*>\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</td>\\s*<td[^>]*>([^<]+)</td>`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function labelValue(html, label) {
  const re = new RegExp(`${label}:\\s*([^<]+)`, 'i');
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

async function fetchState(slug) {
  const url = `https://www.census.gov/schools/statefacts/state.php?${slug}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const html = await res.text();

  const popText = cellAfter(html, 'Population (2024):');
  const densityText = cellAfter(html, 'Persons per square mile (2024):');

  return {
    population: parsePopulation(popText),
    capital: cellAfter(html, 'Capital city:'),
    largestCity: cellAfter(html, 'Largest city:'),
    nickname: labelValue(html, 'State nickname'),
    bird: labelValue(html, 'State bird'),
    animal: labelValue(html, 'State mammal') ?? labelValue(html, 'State animal'),
    density: densityText ? parseFloat(densityText) : null,
  };
}

function buildFact({ population, largestCity, nickname, density }) {
  const parts = [];
  if (nickname) parts.push(`Nickname: ${nickname}.`);
  if (population) {
    const millions = population / 1_000_000;
    const popStr =
      population >= 1_000_000
        ? `${millions >= 10 ? Math.round(millions) : millions.toFixed(1)} million people`
        : `${Math.round(population / 1000)} thousand people`;
    parts.push(`About ${popStr} live here (2024 Census estimate).`);
  }
  if (largestCity) parts.push(`${largestCity} is the largest city.`);
  if (density != null) parts.push(`Roughly ${density} people per square mile.`);
  if (!parts.length) return 'Facts from U.S. Census Bureau State Facts for Students.';
  return parts.join(' ');
}

async function main() {
  const details = {};
  const facts = {};

  for (const [code, slug] of Object.entries(STATE_SLUGS)) {
    try {
      const data = await fetchState(slug);
      details[code] = {
        capital: data.capital,
        population: data.population,
        bird: data.bird,
        animal: data.animal,
        largestCity: data.largestCity,
        nickname: data.nickname,
        density: data.density,
      };
      facts[code] = buildFact(data);
      console.log(`✓ ${code}`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      console.error(`✗ ${code}: ${e.message}`);
    }
  }

  const detailsPath = path.join(ROOT, 'src', 'data', 'stateDetails.js');
  const detailLines = Object.entries(details)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, d]) => {
      const fields = [
        d.capital && `capital: ${JSON.stringify(d.capital)}`,
        d.population != null && `population: ${d.population}`,
        d.largestCity && `largestCity: ${JSON.stringify(d.largestCity)}`,
        d.nickname && `nickname: ${JSON.stringify(d.nickname)}`,
        d.density != null && `density: ${d.density}`,
        d.bird && `bird: ${JSON.stringify(d.bird)}`,
        d.animal && `animal: ${JSON.stringify(d.animal)}`,
      ].filter(Boolean);
      return `  ${code}: { ${fields.join(', ')} },`;
    });

  fs.writeFileSync(
    detailsPath,
    [
      '/** Capital, population, symbols — U.S. Census Bureau State Facts for Students (2024). */',
      '/** https://www.census.gov/schools/statefacts/ */',
      'export const STATE_DETAILS = {',
      ...detailLines,
      '};',
      '',
      'export function formatPopulation(n) {',
      '  if (n >= 1_000_000) {',
      '    const m = n / 1_000_000;',
      '    return m >= 10 ? `${Math.round(m)} million` : `${m.toFixed(1)} million`;',
      '  }',
      '  if (n >= 1_000) return `${Math.round(n / 1_000)} thousand`;',
      '  return String(n);',
      '}',
      '',
    ].join('\n')
  );

  const statesPath = path.join(ROOT, 'src', 'data', 'states.js');
  let statesText = fs.readFileSync(statesPath, 'utf8');
  for (const [code, fact] of Object.entries(facts)) {
    const re = new RegExp(
      `(\\{\\s*code:\\s*'${code}'[\\s\\S]*?fact:\\s*)(["'])(?:\\\\.|(?!\\2).)*\\2`,
      'm'
    );
    if (!re.test(statesText)) {
      console.warn(`  skip fact update for ${code}`);
      continue;
    }
    statesText = statesText.replace(re, `$1${JSON.stringify(fact)}`);
  }
  fs.writeFileSync(statesPath, statesText);
  console.log(`\nUpdated ${Object.keys(details).length} states from Census State Facts.`);
}

main();
