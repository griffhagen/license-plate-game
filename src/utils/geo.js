const GEO_ERRORS = {
  1: 'Location was blocked for this site. Tap the button again and choose Allow when your phone asks — you can keep Safari set to Ask for all websites. If you previously tapped Don\'t Allow, reset only this site: in Safari, tap the AA icon in the address bar → Website Settings → Location → Ask.',
  2: 'Location unavailable right now. Try again outdoors or move somewhere with a clearer signal.',
  3: 'Location timed out. Tap try again — when your phone asks, tap Allow.',
};

function getPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(Object.assign(new Error('Geolocation not supported'), { code: 0 }));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function reverseGeocodeLabel(latitude, longitude) {
  let label = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
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
    /* keep coordinate label */
  }
  return label;
}

/**
 * One GPS request per tap so iOS "Ask" can show a single permission prompt.
 * Only retries on timeout/unavailable — not after permission denied.
 */
export async function getCurrentLocation() {
  if (!navigator.geolocation) {
    return {
      latitude: null,
      longitude: null,
      label: null,
      errorMessage: 'This browser does not support location.',
    };
  }

  const primary = { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 };
  const retry = { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 };

  let lastCode = null;
  for (const [index, options] of [primary, retry].entries()) {
    try {
      const pos = await getPosition(options);
      const { latitude, longitude } = pos.coords;
      const label = await reverseGeocodeLabel(latitude, longitude);
      return { latitude, longitude, label, errorMessage: null };
    } catch (err) {
      lastCode = err?.code ?? null;
      // Permission denied — do not fire a second request (breaks "Ask" on iPhone)
      if (lastCode === 1) break;
      // Only retry once on timeout or unavailable
      if (index === 0 && (lastCode === 2 || lastCode === 3)) continue;
      break;
    }
  }

  return {
    latitude: null,
    longitude: null,
    label: null,
    errorMessage: GEO_ERRORS[lastCode] || 'Could not get your location. Tap try again and choose Allow when asked.',
  };
}
