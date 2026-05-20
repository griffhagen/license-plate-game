import { useState } from 'react';
import { getPlateImageUrl } from '../data/plateImages';
import { STATE_BY_CODE } from '../data/states';

export default function PlateImage({ code, className = '', size = 'md', alt }) {
  const [failed, setFailed] = useState(false);
  const url = getPlateImageUrl(code);
  const name = STATE_BY_CODE[code]?.name ?? code;

  if (!url || failed) {
    return (
      <div className={`plate-fallback plate-fallback--${size} ${className}`} aria-hidden>
        {code}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt ?? `${name} license plate`}
      className={`plate-image plate-image--${size} ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
