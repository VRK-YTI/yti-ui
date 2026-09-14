// Next.js' own convention. Kept in sync so that enabling
// i18n.localeDetection or adding a proxy works with this.
export const LOCALE_COOKIE = 'NEXT_LOCALE';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function setLocaleCookie(locale: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const secure = window.location.protocol === 'https:' ? '; secure' : '';

  document.cookie =
    `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}` +
    `; samesite=lax${secure}`;
}
