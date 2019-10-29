/**
 * Returns the current unix epoch (seconds).
 */
export function now() {

  return Math.trunc(Date.now() / 1000);
}
