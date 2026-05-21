import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATE_BY_CODE } from '../data/states';
import { getPlateImageUrl } from '../data/plateImages';
import PlateImage from './PlateImage';
import { hasGeoCoords } from '../utils/findingLocation';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function popupHtml(finding) {
  const state = STATE_BY_CODE[finding.stateCode];
  const code = escapeHtml(finding.stateCode);
  const name = escapeHtml(state?.name ?? finding.stateCode);
  const player = escapeHtml(finding.playerName);
  const rel = getPlateImageUrl(finding.stateCode);
  const imgUrl = rel ? `${window.location.origin}${rel}` : null;
  const img = imgUrl
    ? `<img src="${escapeHtml(imgUrl)}" alt="${name} plate" class="popup-plate-img" />`
    : `<div class="popup-plate-fallback">${code}</div>`;
  const when = escapeHtml(new Date(finding.foundAt).toLocaleString());
  const loc = finding.locationLabel
    ? `<p class="popup-loc">${escapeHtml(finding.locationLabel)}</p>`
    : '';
  return `
    <div class="map-popup">
      ${img}
      <strong>${name}</strong>
      <p>Spotted by ${player}</p>
      <p class="popup-meta">${when}</p>
      ${loc}
    </div>
  `;
}

export default function MapPage({ findings, onGoToPlates }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const geoFindings = findings.filter(hasGeoCoords);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([39.8283, -98.5795], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markers = geoFindings.map((f) => {
      const m = L.marker([f.latitude, f.longitude], { icon: defaultIcon });
      m.bindPopup(popupHtml(f), { maxWidth: 260 });
      m.addTo(map);
      return m;
    });

    if (markers.length === 1) {
      map.setView([geoFindings[0].latitude, geoFindings[0].longitude], 10);
    } else if (markers.length > 1) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15));
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [findings]);

  if (geoFindings.length === 0) {
    return (
      <div className="map-empty">
        <span className="map-empty-icon" aria-hidden>
          ◉
        </span>
        <p className="map-empty-title">No map pins yet</p>
        <p className="map-empty-hint">
          Mark a plate on the Plates tab and allow location when asked. Pins show where you spotted each state.
        </p>
        {findings.length > 0 && (
          <p className="map-empty-meta">
            {findings.length} plate{findings.length !== 1 ? 's' : ''} logged without GPS.
          </p>
        )}
        {onGoToPlates && (
          <button type="button" className="btn-primary map-empty-cta" onClick={onGoToPlates}>
            Go to Plates
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="map-page">
      <p className="map-summary">
        {geoFindings.length} spot{geoFindings.length !== 1 ? 's' : ''} on the map
        {findings.length > geoFindings.length &&
          ` · ${findings.length - geoFindings.length} without GPS`}
      </p>
      <div ref={containerRef} className="map-container" role="application" aria-label="Map of plate sightings" />
      <ul className="map-legend">
        {geoFindings.map((f) => (
          <li key={f.stateCode}>
            <PlateImage code={f.stateCode} size="sm" className="legend-plate" />
            <span>
              <strong>{STATE_BY_CODE[f.stateCode]?.name ?? f.stateCode}</strong>
              {f.locationLabel && <span className="legend-loc"> — {f.locationLabel}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
