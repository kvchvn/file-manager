import process from 'node:process';

export const printCurrentCwd = () => {
  process.stdout.write(`You are currently in ${process.cwd()}> `);
}