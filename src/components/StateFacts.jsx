import { formatPopulation } from '../data/stateDetails';

export default function StateFacts({ state }) {
  return (
    <section className="state-facts" aria-label={`About ${state.name}`}>
      <dl className="state-facts-grid">
        <div className="state-facts-item">
          <dt>Capital</dt>
          <dd>{state.capital}</dd>
        </div>
        <div className="state-facts-item">
          <dt>Population</dt>
          <dd>{formatPopulation(state.population)}</dd>
        </div>
        <div className="state-facts-item">
          <dt>State bird</dt>
          <dd>{state.bird}</dd>
        </div>
        <div className="state-facts-item">
          <dt>State animal</dt>
          <dd>{state.animal}</dd>
        </div>
      </dl>
      <div className="state-fact-block">
        <h3 className="state-fact-heading">Did you know?</h3>
        <p className="state-fact">{state.fact}</p>
      </div>
    </section>
  );
}
