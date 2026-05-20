export function isIos() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** True when opened from Add to Home Screen (not a normal Safari tab). */
export function isStandaloneApp() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export function safariLocationHint() {
  if (isIos() && isStandaloneApp()) {
    return 'Location often fails in the iPhone home-screen app. Open your trip in Safari (link below), mark the plate there, then return here — or use Save without map location.';
  }
  return null;
}
