export function getNow(req) {
  if (
    process.env.TEST_MODE === '1' &&
    req?.headers?.['x-test-now-ms']
  ) {
    return Number(req.headers['x-test-now-ms'])
  }
  return Date.now()
}

export function getExpirationTime(minutesFromNow = 60) {
  const now = Date.now()
  const expiration = now + minutesFromNow * 60 * 1000
  return expiration
}

export function isExpired(expirationTime) {
  return Date.now() > expirationTime
}

export function timeUntilExpiration(expirationTime) {
  const remaining = expirationTime - Date.now()
  return Math.max(0, remaining)
}
