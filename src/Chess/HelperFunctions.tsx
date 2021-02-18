import type { Square } from './constants';

export function convertToAlgebra(input: Square): string {
  const stringX = `${input.x}`;
  const letter = String.fromCharCode(stringX.charCodeAt(0) + (97 - 49));
  return letter + input.y;
}

export function whiteColorSquare(input: Square): boolean {
  const xEven = input.x % 2 === 0;
  const yEven = input.y % 2 === 0;

  return !((xEven && yEven) || (!xEven && !yEven));
}
