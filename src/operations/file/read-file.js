import fs from 'node:fs';
import path from "node:path";
import process from 'node:process';

export const readFile = async (filePath) => {
  const fullPath = path.resolve(filePath);

  const rs = fs.createReadStream(fullPath, { encoding: 'utf8' });

  await new Promise((resolve, reject) => {
    rs.on('error', reject);
    rs.on('end', () => {
      process.stdout.write('\n');
      resolve();
    });
    rs.on('data', (chunk) => {
      process.stdout.write(chunk.toString());
    })
  });
}