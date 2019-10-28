/**
 * Returns the current unix epoch (seconds).
 */
export function now() {
  const epochMillis = new Date().getTime();

  return Math.trunc(epochMillis / 1000);
}
