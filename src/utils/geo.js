const GEO_ERRORS = {
  1: 'Location permission denied. On iPhone: Settings → Safari → Location → Allow, or enable Location for this app.',
  2: 'Location unavailable. Try again outdoors or check that Location Services are on.',
  3: 'Location timed out. Try again in a moment.',
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
 * Best-effort GPS for road trips. Tries a quick fix first (works better on iPhone),
 * then high accuracy. Returns { latitude, longitude, label, errorMessage }.
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

  const attempts = [
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 120000 },
  ];

  let lastCode = null;
  for (const options of attempts) {
    try {
      const pos = await getPosition(options);
      const { latitude, longitude } = pos.coords;
      const label = await reverseGeocodeLabel(latitude, longitude);
      return { latitude, longitude, label, errorMessage: null };
    } catch (err) {
      lastCode = err?.code ?? null;
    }
  }

  return {
    latitude: null,
    longitude: null,
    label: null,
    errorMessage: GEO_ERRORS[lastCode] || 'Could not get your location. Check permissions and try again.',
  };
}
