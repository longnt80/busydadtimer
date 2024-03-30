/**
 * Create a promise that resolve in a number of milliseconds
 * @param ms - Number of milliseconds
 * @returns
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
