import process from 'node:process';
import os from 'node:os';
import readline from 'node:readline/promises';
import { greet } from "./utils/greet.js";
import { bye } from "./utils/bye.js";
import { printCwd } from "./utils/print-cwd.js";
import { commandDispatcher } from "./operations/command-dispatcher.js";
import { printError } from "./utils/print-error.js";

export const runFileManager = async () => {
  greet();
  /**
   * Initial directory is homedir
   */
  process.chdir(os.homedir());

  readline.createInterface(process.stdin)
    .on('line', async (line) => {
      if (line) {
        await commandDispatcher(line);
      }

      printCwd();
    });

  // Initial
  printCwd();

  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('exit', bye);
};