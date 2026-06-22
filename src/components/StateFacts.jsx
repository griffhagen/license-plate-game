import { formatPopulation } from '../data/stateDetails';

export default function StateFacts({ plate }) {
  const isTribal = plate.label === 'Tribal nation plate';
  const isIntl = plate.code === 'CAN' || plate.code === 'MEX';

  return (
    <section className="state-facts" aria-label={`About ${plate.name}`}>
      <dl className="state-facts-grid">
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
        {plate.population != null && (
          <div className="state-facts-item">
            <dt>{isTribal ? 'Citizens (approx.)' : 'Population'}</dt>
            <dd>{formatPopulation(plate.population)}</dd>
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
      </dl>
      <div className="state-fact-block">
        <h3 className="state-fact-heading">Did you know?</h3>
        <p className="state-fact">{plate.fact}</p>
      </div>
    </section>
  );
}
