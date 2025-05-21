import { goToDir, goUp } from "./dir/go-to-dir.js";
import { printError } from "../utils/print-error.js";
import { readDir } from "./dir/read-dir.js";
import { readFile } from "./file/read-file.js";
import { createFile } from "./file/create-file.js";
import { createDir } from "./dir/create-dir.js";
import { renameFile } from "./file/rename-file.js";
import { parseCommandLine } from "../utils/parse-command-line.js";
import { ERROR } from "../constants.js";

/**
 * @type {{ [string]: { argsCount: number; callback: (args?: unknown[]) => void } }}
 */
const SUPPORTED_COMMANDS = {
  '.exit': { argsCount: 0, callback: process.exit },
  up: { argsCount: 0, callback: goUp },
  ls: { argsCount: 0, callback: readDir },
  cd: { argsCount: 1, callback: goToDir },
  cat: { argsCount: 1, callback: readFile },
  add: { argsCount: 1, callback: createFile },
  mkdir: { argsCount: 1, callback: createDir },
  rn: { argsCount: 2, callback: renameFile },
}

/**
 * @param line {string} Command line
 */
export const commandDispatcher = async (line) => {
  try {
    const [baseCommand, ...args] = parseCommandLine(line);

    console.log({ baseCommand, args });

    const currentCommand = SUPPORTED_COMMANDS[baseCommand];
    if (currentCommand && args.length >= currentCommand.argsCount) {
      await currentCommand.callback?.(...args.slice(0, currentCommand.argsCount));
    } else {
      throw new Error(ERROR.unsupportedCommand);
    }
  } catch (err) {
    printError(err);
  }
}