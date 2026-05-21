import { useState } from 'react';

export default function SharePanel({ gameId, gameName, players, onClose }) {
  const [copied, setCopied] = useState('');

  const url = `${window.location.origin}/?join=${gameId}`;

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      window.prompt('Copy:', text);
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
        /* cancelled */
      }
    }
    copyText(url, 'link');
  };

  return (
    <div className="share-panel">
      <div className="share-panel-header">
        <p className="share-panel-title">Invite your crew</p>
        {onClose && (
          <button type="button" className="btn-text share-panel-close" onClick={onClose}>
            Close
          </button>
        )}
      </div>
      <div className="share-code-block">
        <span className="share-label">Game code</span>
        <div className="share-code-row">
          <code className="share-code-value">{gameId}</code>
          <button
            type="button"
            className="btn-copy"
            onClick={() => copyText(gameId, 'code')}
          >
            {copied === 'code' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <p className="share-players">
        <span className="share-players-count">{players.length}</span> playing:{' '}
        {players.map((p) => p.name).join(', ')}
      </p>
      <div className="share-actions">
        <button type="button" className="btn-primary" onClick={shareNative}>
          Share invite link
        </button>
        <button type="button" className="btn-secondary" onClick={() => copyText(url, 'link')}>
          {copied === 'link' ? 'Link copied' : 'Copy link only'}
        </button>
      </div>
    </div>
  );
}
