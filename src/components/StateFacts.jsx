import { formatPopulation } from '../data/stateDetails';

export default function StateFacts({ plate }) {
  const isTribal = plate.label === 'Tribal nation plate';
  const isIntl = plate.label === 'Canadian province plate' || plate.label === 'Mexican state plate';
  const isUsState = !plate.bonus;

  return (
    <section className="state-facts" aria-label={`About ${plate.name}`}>
      <dl className="state-facts-grid">
        {plate.nickname && isUsState && (
          <div className="state-facts-item">
            <dt>Nickname</dt>
            <dd>{plate.nickname}</dd>
          </div>
        )}
        {plate.capital && (
          <div className="state-facts-item">
            <dt>{plate.code === 'DC' ? 'Capital' : isIntl ? 'Capital' : 'Capital'}</dt>
            <dd>{plate.capital}</dd>
          </div>
        )}
        {plate.region && !plate.capital && (
          <div className="state-facts-item">
            <dt>Region</dt>
            <dd>{plate.region}</dd>
          </div>
        )}
        {plate.region && plate.capital && plate.code === 'DC' && (
          <div className="state-facts-item">
            <dt>Region</dt>
            <dd>{plate.region}</dd>
          </div>
        )}
        {plate.largestCity && isUsState && (
          <div className="state-facts-item">
            <dt>Largest city</dt>
            <dd>{plate.largestCity}</dd>
          </div>
        )}
        {plate.population != null && (
          <div className="state-facts-item">
            <dt>{isTribal ? 'Citizens (approx.)' : 'Population'}</dt>
            <dd>{formatPopulation(plate.population)}</dd>
          </div>
        )}
        {plate.density != null && isUsState && (
          <div className="state-facts-item">
            <dt>People per sq. mi.</dt>
            <dd>{plate.density}</dd>
          </div>
        )}
        {plate.bird && (
          <div className="state-facts-item">
            <dt>{isIntl ? 'National bird' : plate.code === 'DC' ? 'Bird' : 'State bird'}</dt>
            <dd>{plate.bird}</dd>
          </div>
        )}
        {plate.animal && (
          <div className="state-facts-item">
            <dt>{isIntl ? 'National animal' : plate.code === 'DC' ? 'Animal' : 'State animal'}</dt>
            <dd>{plate.animal}</dd>
          </div>
        )}
        {isTribal && plate.region && plate.capital == null && (
          <div className="state-facts-item">
            <dt>Plate type</dt>
            <dd>Tribal nation</dd>
          </div>
        )}
        {isIntl && (
          <div className="state-facts-item">
            <dt>Plate type</dt>
            <dd>{plate.label === 'Canadian province plate' ? 'Canadian province' : 'Mexican state'}</dd>
          </div>
        )}
      </dl>
      <div className="state-fact-block">
        <h3 className="state-fact-heading">Did you know?</h3>
        <p className="state-fact">{plate.fact}</p>
        {isUsState && (
          <p className="state-fact-source">
            Population and symbols from{' '}
            <a
              href={`https://www.census.gov/schools/statefacts/state.php?${plate.name.toLowerCase().replace(/\s+/g, '_')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Census State Facts for Students
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
