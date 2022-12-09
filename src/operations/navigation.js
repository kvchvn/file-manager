import { dirname, join, relative, resolve } from 'path';
import { readdir } from 'fs/promises';

import { INVALID_INPUT_ERROR, OPERATION_FAILED_ERROR } from '../constants.js';
import { print } from '../utils.js';

const goToUpperDir = (argsArray) => {
    try {
        if (argsArray) throw new Error(INVALID_INPUT_ERROR);

        const currentDir = process.cwd();
        const upperDir = dirname(currentDir);
        process.chdir(upperDir);
    } catch (err) {
        const { message } = err;
        print(message);
    }
};

const changeDir = (argsArray) => {
    try {
        if (!argsArray || argsArray.length > 1) throw new Error(INVALID_INPUT_ERROR);

        const [ folderName ] = argsArray;
        const currentDir = process.cwd();
        const newDir = join(currentDir, folderName);

        const relativePath = relative(currentDir, newDir);
        const resolvedPath = resolve(relativePath);

        process.chdir(resolvedPath);
    } catch (err) {
        console.log('[ERROR CODE] ', err.code);
        let { message } = err;
        if (err.code) {
            switch (err.code) {
                case 'ENOENT': message = `${OPERATION_FAILED_ERROR} Such directory was not found.`
                    break;
                case 'ERR_INVALID_ARG_TYPE': message = `${INVALID_INPUT_ERROR} Folder's name should be string.`
                    break;
                default: message = `${OPERATION_FAILED_ERROR}`;
            }
        }
        print(message);
    }
};

const readCurrentDir = async () => {
  const currentDir = process.cwd();
  try {
      const dirContent = await readdir(currentDir, { withFileTypes: true });
      const tableContent = dirContent
          .map((dirent) => ({
              Name: dirent.name,
              Type: dirent.isDirectory() ? 'directory' : 'file',
          }))
          .sort((a, b) => a.Type < b.Type ? -1 : 1);
      console.table(tableContent);
  } catch (err) {
      print(err);
  }
};

const handleNavigationCommand = async (mainCommand, parsedArgsArray) => {
    // console.log('commands: ', mainCommand, argsArray);
    // console.log('parsed: ', parsedArgsArray);
     switch (mainCommand) {
         case 'up': goToUpperDir(parsedArgsArray)
             break;
         case 'cd': changeDir(parsedArgsArray)
             break;
         case 'ls': await readCurrentDir()
             break;
     }
};

export default handleNavigationCommand;
