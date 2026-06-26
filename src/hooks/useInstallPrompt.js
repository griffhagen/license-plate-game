import { useEffect, useState } from 'react';
import { isStandaloneApp } from '../utils/device';

/** Captures the Android/desktop Chrome `beforeinstallprompt` event so we can
 *  trigger the native "Add to Home Screen" flow from our own menu button. */
export function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null);
  const [installed, setInstalled] = useState(isStandaloneApp());

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const canPrompt = Boolean(deferredEvent) && !installed;

  const promptInstall = async () => {
    if (!deferredEvent) return 'unsupported';
    deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    setDeferredEvent(null);
    return outcome;
  };

  return { installed, canPrompt, promptInstall };
}
