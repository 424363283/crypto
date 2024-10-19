export function makeWWWOrigin() {
  const { origin } = location;

  if (process.env.TEST_ORIGIN && process.env.TARGET_ORIGIN && origin.includes(process.env.TEST_ORIGIN)) {
    return origin.replace(process.env.TEST_ORIGIN, process.env.TARGET_ORIGIN);
  }

  return origin;
}
