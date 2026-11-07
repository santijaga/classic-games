export const tiles = [
  { name: 'Blue', mark: '●' },
  { name: 'Red', mark: '■' },
  { name: 'Green', mark: '▲' },
  { name: 'Gold', mark: '◆' },
  { name: 'Purple', mark: '✚' },
  { name: 'Teal', mark: '✦' },
];

export function neighbors(index: number, width: number, length: number): number[] {
  const result: number[] = [];
  if (index % width > 0) result.push(index - 1);
  if (index % width < width - 1) result.push(index + 1);
  if (index >= width) result.push(index - width);
  if (index + width < length) result.push(index + width);
  return result;
}

export function tileLabel(index: number, width: number, color: number): string {
  return `${tiles[color].name}, row ${Math.floor(index / width) + 1}, column ${index % width + 1}`;
}
