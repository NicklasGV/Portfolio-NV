// The canonical origin, in one place.
//
// www.nicklasvedeby.com serves the same site, so falling back to
// window.location.origin meant a visitor who arrived on www got canonical and
// hreflang tags pointing at www, telling Google the two hosts are separate
// sites. In production the host is pinned; locally it follows the dev server.
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (import.meta.env.PROD ? 'https://nicklasvedeby.com' : '')

export const resolveOrigin = () =>
  SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
