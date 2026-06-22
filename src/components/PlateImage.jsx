import { useState } from 'react';
import { getPlateImageUrl } from '../data/plateImages';
import { getPlateByCode } from '../data/registry';

export default function PlateImage({ code, className = '', size = 'md', alt }) {
  const [failed, setFailed] = useState(false);
  const url = getPlateImageUrl(code);
  const plate = getPlateByCode(code);
  const name = plate?.name ?? code;
  const fallback = code.length <= 3 ? code : code.slice(0, 3);

  if (!url || failed) {
    return (
      <div className={`plate-fallback plate-fallback--${size} ${className}`} aria-hidden>
        {fallback}
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
