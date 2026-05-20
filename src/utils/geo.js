import { isIos, isStandaloneApp, safariLocationHint } from './device.js';

const GEO_ERRORS = {
  1: 'This site is not allowed to use location. Check Website Settings → Location is Allow, then try again.',
  2: 'GPS signal not available. Step outside or wait a moment, then try again.',
  3: 'Location timed out. Try again, or open the game in Safari if you use the home-screen icon.',
};

function getCurrentPositionRace(options, hardTimeoutMs) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0 });
      return;
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject({ code: 3 });
      }
    }, hardTimeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(pos);
        }
      },
      (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      },
      options
    );
  });
}

function watchPositionOnce(options, hardTimeoutMs) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0 });
      return;
    }

    let settled = false;
    let watchId;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
      fn(value);
    };

    const timer = setTimeout(() => finish(reject, { code: 3 }), hardTimeoutMs);

    watchId = navigator.geolocation.watchPosition(
      (pos) => finish(resolve, pos),
      (err) => finish(reject, err),
      options
    );
  });
}

async function reverseGeocodeLabel(latitude, longitude) {
  let label = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
          'User-Agent': 'LicensePlateGame/1.0 (road trip PWA)',
        },
      }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data.display_name) {
        const parts = data.display_name.split(', ');
        label = parts.slice(0, 3).join(', ');
      }
    }
  } catch {
    /* coordinates are enough for the map */
  }
  return label;
}

function buildError(lastCode) {
  let msg = GEO_ERRORS[lastCode] || 'Could not get your location.';
  const safari = safariLocationHint();
  if (safari) msg = `${msg} ${safari}`;
  return msg;
}

/**
 * Start GPS on the same tap that triggered it (required for iOS).
 * Call this directly from a button click — do not await other work first.
 */
export function startLocationCapture() {
  if (!navigator.geolocation) {
    return Promise.resolve({
      latitude: null,
      longitude: null,
      label: null,
      errorMessage: 'This browser does not support location.',
    });
  }

  const standaloneIos = isIos() && isStandaloneApp();
  const hardTimeout = standaloneIos ? 10000 : 22000;

  const strategies = [
    () =>
      getCurrentPositionRace(
        { enableHighAccuracy: false, maximumAge: 900000, timeout: hardTimeout },
        hardTimeout
      ),
    () =>
      watchPositionOnce(
        { enableHighAccuracy: false, maximumAge: 900000, timeout: hardTimeout },
        hardTimeout
      ),
  ];

  if (!standaloneIos) {
    strategies.push(() =>
      getCurrentPositionRace(
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
        15000
      )
    );
  }

  return (async () => {
    let lastCode = null;
    for (const strategy of strategies) {
      try {
        const pos = await strategy();
        const { latitude, longitude } = pos.coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          lastCode = 2;
          continue;
        }
        const label = await reverseGeocodeLabel(latitude, longitude);
        return { latitude, longitude, label, errorMessage: null };
      } catch (err) {
        lastCode = err?.code ?? 3;
        if (lastCode === 1) break;
      }
    }

    return {
      latitude: null,
      longitude: null,
      label: null,
      errorMessage: buildError(lastCode),
    };
  })();
}

/** @deprecated Use startLocationCapture from click handlers */
export function getCurrentLocation() {
  return startLocationCapture();
}
