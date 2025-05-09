import process from 'node:process';
import os from 'node:os';
import readline from 'node:readline/promises';
import { greet } from "./utils/greet.js";
import { bye } from "./utils/bye.js";
import { printCurrentCwd } from "./utils/print.js";
import { commandDispatcher } from "./operations/command-dispatcher.js";

export const runFileManager = async () => {
  greet();
  /**
   * Initial directory is homedir
   */
  process.chdir(os.homedir());

  readline.createInterface(process.stdin, process.stdout)
    .on('line', (line) => {
      commandDispatcher(line);
      printCurrentCwd();
    });

  printCurrentCwd();

  process.on('SIGINT', () => {
    process.exit();
  });
  process.on('exit', bye);
};