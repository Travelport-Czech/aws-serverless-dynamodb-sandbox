/**
 * Prevent using Node.js Event Loop for Timing Attacks
 * source: https://snyk.io/blog/node-js-timing-attack-ccc-ctf/
 */
export const passwordsAreSame = (a: string, b: string): boolean => {
  let mismatch = 0;
  for (let i = 0; i < a.length; i = i + 1) {
    // tslint:disable-next-line:no-bitwise
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
};
