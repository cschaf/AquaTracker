import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js', { scope: '/' });

    wb.addEventListener('waiting', () => {
      const updateAccepted = window.confirm(
        'A new version of the application is available. Reload to update?'
      );
      if (updateAccepted) {
        wb.messageSkipWaiting();
      }
    });

    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    wb.register();
  }
}
