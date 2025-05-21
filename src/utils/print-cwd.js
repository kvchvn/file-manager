import process from 'node:process';

export const printCwd = () => {
  process.stdout.write(`You are currently in ${process.cwd()}> `);
}