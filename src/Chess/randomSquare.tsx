export interface Square {
  x: number;
  y: number;
}

export function randomSquare(): Square {
  return {
    x: Math.floor(Math.random() * 8) + 1,
    y: Math.floor(Math.random() * 8) + 1,
  };
}
