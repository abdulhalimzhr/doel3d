/* eslint-disable @typescript-eslint/no-require-imports */

import * as fs from 'fs';
// Define the type for NodeStl
interface NodeStlType {
  new (buffer: Buffer): {
    volume: number;
    weight: number;
  };
}
const NodeStl = require('node-stl') as NodeStlType;

export function parseStlVolume(filePath: string): {
  volumeCm3: number;
  weightGrams: number;
} {
  if (!filePath) throw new Error('File path is undefined');
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const data = fs.readFileSync(filePath);
  const stl = new NodeStl(data);
  console.log(`STL data`, stl);
  return {
    volumeCm3: stl.volume,
    weightGrams: stl.weight,
  };
}
