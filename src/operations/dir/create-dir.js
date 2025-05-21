import fsPromises from "node:fs/promises";
import path from 'node:path';

export const createDir = async (dirname) => {
  const dirpath = path.resolve(dirname);
  await fsPromises.mkdir(dirpath, { recursive: true });
}