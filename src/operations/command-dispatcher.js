import { goToDirectory } from "./go-to-directory.js";
import { printError } from "../utils/print-error.js";
import { readDir } from "./read-dir.js";

/**
 * @param line {string} Command line
 */
export const commandDispatcher = async (line) => {
  const [baseCommand, ...args] = line.split(' ');

  try {
    switch (baseCommand) {
      case 'up': {
        goToDirectory('../');
        break;
      }
      case 'cd': {
        goToDirectory(args[0]);
        break;
      }
      case 'ls': {
        await readDir();
        break;
      }
      case '.exit': {
        process.exit();
        break;
      }
      default:
        console.log('Invalid input!');
    }
  } catch (err) {
    printError(err);
  }
}