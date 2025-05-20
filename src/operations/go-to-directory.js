import process from 'node:process';
import path from 'node:path';

export const goToDirectory = (dir) => {
  if (!dir) {
    return;
  }

  const newDir = path.resolve(process.cwd(), dir);
  process.chdir(newDir);
}