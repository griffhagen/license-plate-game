export async function getCurrentLocation() {
  if (!navigator.geolocation) {
    return { latitude: null, longitude: null, label: null };
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let label = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'LicensePlateGame/1.0 (road trip PWA)',
              },
            }
          );
          const data = await res.json();
          if (data.display_name) {
            const parts = data.display_name.split(', ');
            label = parts.slice(0, 3).join(', ');
          }
        } catch {
          /* keep coordinates */
        }
        resolve({ latitude, longitude, label });
      },
      () => resolve({ latitude: null, longitude: null, label: null }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}
