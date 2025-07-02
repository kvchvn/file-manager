import { ERROR } from "../constants.js";
import { parseCommandLine } from "../utils/parse-command-line.js";
import { printError } from "../utils/print-error.js";
import { createDir } from "./dir/create-dir.js";
import { goToDir, goUp } from "./dir/go-to-dir.js";
import { readDir } from "./dir/read-dir.js";
import { copyFile } from "./file/copy-file.js";
import { createFile } from "./file/create-file.js";
import { moveFile } from "./file/move-file.js";
import { readFile } from "./file/read-file.js";
import { removeFile } from "./file/remove-file.js";
import { renameFile } from "./file/rename-file.js";
import { getOsInfo } from "./os/get-os-info.js";

/**
 * @type {{ [string]: { argsCount: number; callback: (args?: unknown[]) => void } }}
 */
const SUPPORTED_COMMANDS = {
  ".exit": { argsCount: 0, callback: process.exit },
  up: { argsCount: 0, callback: goUp },
  ls: { argsCount: 0, callback: readDir },
  cd: { argsCount: 1, callback: goToDir },
  cat: { argsCount: 1, callback: readFile },
  add: { argsCount: 1, callback: createFile },
  mkdir: { argsCount: 1, callback: createDir },
  rn: { argsCount: 2, callback: renameFile },
  cp: { argsCount: 2, callback: copyFile },
  mv: { argsCount: 2, callback: moveFile },
  rm: { argsCount: 1, callback: removeFile },
  os: { argsCount: 1, callback: getOsInfo },
};

/**
 * @param line {string} Command line
 */
export const commandDispatcher = async (line) => {
  try {
    const [baseCommand, ...args] = parseCommandLine(line);

    console.log({ baseCommand, args });

    const currentCommand = SUPPORTED_COMMANDS[baseCommand];

    if (!currentCommand) {
      throw new Error(ERROR.unsupportedCommand, { cause: ERROR.invalidInput });
    }

    // excessive args will be ignored
    if (args.length < currentCommand.argsCount) {
      throw new Error(ERROR.invalidArgs, { cause: ERROR.invalidInput });
    }

    await currentCommand.callback?.(...args.slice(0, currentCommand.argsCount));
  } catch (err) {
    printError(err);
  }
};
