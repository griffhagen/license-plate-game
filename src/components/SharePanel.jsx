import { useState } from 'react';

export default function SharePanel({ gameId, gameName, players }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/?join=${gameId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback below */
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${gameName} — License Plate Game`,
          text: `Join our road trip plate game! Code: ${gameId}`,
          url,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copyLink();
  };

  return (
    <div className="share-panel">
      <div className="share-code">
        <span className="share-label">Game code</span>
        <code>{gameId}</code>
      </div>
      <p className="share-players">
        {players.length} player{players.length !== 1 ? 's' : ''}:{' '}
        {players.map((p) => p.name).join(', ')}
      </p>
      <div className="share-actions">
        <button type="button" className="btn-secondary" onClick={shareNative}>
          Share invite
        </button>
        <button type="button" className="btn-ghost" onClick={copyLink}>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
