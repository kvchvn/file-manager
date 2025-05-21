import process from 'node:process';
import path from 'node:path';

export const goToDir = (dir) => {
  process.chdir(path.resolve(dir));
}

export const goUp = () => goToDir('../')