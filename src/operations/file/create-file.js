import fsPromises from "node:fs/promises";
import path from 'node:path';

export const createFile = async (filename) => {
  const filepath = path.resolve(filename);
  await fsPromises.writeFile(filepath, '', { flag: 'wx' });
}