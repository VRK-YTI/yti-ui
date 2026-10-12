import { NextRequest, NextResponse } from 'next/server';
import { LOCALE_COOKIE } from 'yti-common-ui/utils/locale-cookie';

const LOCALES = ['fi', 'en'];
const FALLBACK = 'fi';

// Paths served independently of the user's locale. '/datamodel-api/' etc. does
// not contain '/api/' as a substring ('-api/'), so every proxied backend from
// next.config.js has to be listed explicitly.
const SKIPPED_PREFIXES = [
  '/_next/',
  '/api/',
  '/datamodel-api/',
  '/terminology-api/',
  '/codelist-api/',
  '/messaging-api/',
  '/Shibboleth.sso/',
];

// An explicit extension list rather than /\.(.*)$/ regexp, since model prefixes and
// resource identifiers may contain dots.
const STATIC_FILE =
  /\.(ico|png|jpe?g|svg|gif|webp|avif|json|txt|xml|css|js|map|woff2?|ttf|eot)$/i;

function negotiate(req: NextRequest): string {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  return cookie && LOCALES.includes(cookie) ? cookie : FALLBACK;
}

export default function proxy(req: NextRequest) {
  const { pathname, locale } = req.nextUrl;

  if (
    SKIPPED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    STATIC_FILE.test(pathname)
  ) {
    return;
  }

  // Always respect locale present in url
  if (locale !== 'default') {
    return;
  }

  const target = negotiate(req);
  const url = req.nextUrl.clone();
  url.locale = target;
  const res = NextResponse.redirect(url, 307);

  // The target depends on a stored cookie. A cached redirect would pin
  // one language for every visitor.
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('Vary', 'Cookie');

  return res;
}
