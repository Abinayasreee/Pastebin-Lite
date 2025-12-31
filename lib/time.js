// Deterministic time helper for paste expiration
export function getExpirationTime(minutesFromNow = 60) {
  const now = Date.now();
  const expiration = now + minutesFromNow * 60 * 1000;
  return expiration;
}

export function isExpired(expirationTime) {
  return Date.now() > expirationTime;
}

export function timeUntilExpiration(expirationTime) {
  const remaining = expirationTime - Date.now();
  return Math.max(0, remaining);
}
