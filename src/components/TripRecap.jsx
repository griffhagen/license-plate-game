import { useState } from 'react';
import { STATES, TOTAL_STATES, rarityLabel } from '../data/states';
import { TOTAL_BONUS } from '../data/bonusPlates';
import { getAchievementProgress } from '../data/achievements';
import { isStateCode } from '../data/registry';

function buildRecapText(game, findings) {
  const stateFindings = findings.filter((f) => isStateCode(f.stateCode));
  const bonusCount = findings.length - stateFindings.length;
  const foundCodes = new Set(stateFindings.map((f) => f.stateCode));
  const rarest = STATES.filter((s) => foundCodes.has(s.code)).sort((a, b) => b.rarity - a.rarity)[0];
  const earned = getAchievementProgress(findings).filter((a) => a.earned);
  const days = Math.max(1, Math.ceil((Date.now() - new Date(game.createdAt).getTime()) / 86400000));

  const lines = [
    `🚗 ${game.name} — License Plate Game recap`,
    `${stateFindings.length}/${TOTAL_STATES} states · ${bonusCount}/${TOTAL_BONUS} bonus plates`,
    `Over ${days} day${days !== 1 ? 's' : ''} with ${game.players.length} player${game.players.length !== 1 ? 's' : ''}`,
  ];
  if (rarest) {
    lines.push(`Rarest plate spotted: ${rarest.name} (${rarityLabel(rarest.rarity)}, ${rarest.rarity}/10)`);
  }
  if (earned.length > 0) {
    lines.push(`Badges earned: ${earned.length} — ${earned.map((a) => a.emoji).join(' ')}`);
  }
  return lines.join('\n');
}

export default function TripRecap({ game, findings }) {
  const [copied, setCopied] = useState(false);
  const text = buildRecapText(game, findings);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${game.name} recap`, text });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your recap:', text);
    }
  };

  return (
    <div className="trip-recap">
      <pre className="trip-recap-card">{text}</pre>
      <button type="button" className="btn-primary" onClick={share}>
        {copied ? 'Copied!' : 'Share recap'}
      </button>
    </div>
  );
}
