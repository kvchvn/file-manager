import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

import { INVALID_INPUT_ERROR, OPERATION_FAILED_ERROR, ERROR_TYPES } from '../constants.js';
import { resolvePaths, print } from '../utils.js';

const handleNavigationCommand = async (mainCommand, argsArray) => {
    switch (mainCommand) {
        case 'up': goToUpperDir(argsArray)
            break;
        case 'cd': changeDir(argsArray)
            break;
        case 'ls': await readCurrentDir(argsArray)
            break;
    }
};

function goToUpperDir(argsArray) {
    if (argsArray.length) throw new Error(INVALID_INPUT_ERROR);
    try {
        const currentDir = process.cwd();
        const upperDir = dirname(currentDir);
        process.chdir(upperDir);
    } catch {
        print(OPERATION_FAILED_ERROR);
    }
}

function changeDir(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_INPUT_ERROR);
    try {
        const [dirName] = argsArray;
        const currentDir = process.cwd();
        const newDir = join(currentDir, dirName);
        const resolvedPath = resolvePaths(currentDir, newDir);
        process.chdir(resolvedPath);
    } catch (err) {
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.ENOENT: message += ' Such directory was not found.'
                break;
            case ERROR_TYPES.INVALID_ARG: message = `${INVALID_INPUT_ERROR} Folder's name should be string.`
                break;
        }
        print(message);
    }
}

async function readCurrentDir(argsArray) {
    if (argsArray.length) throw new Error(INVALID_INPUT_ERROR);
    try {
        const currentDir = process.cwd();
        const dirContent = await readdir(currentDir, { withFileTypes: true });
        if (dirContent.length) {
            const tableDirContent = dirContent
                .map((dirent) => {
                    let type = 'unknown';
                    if (dirent.isFile()) type = 'file';
                    if (dirent.isDirectory()) type = 'directory';
                    if (dirent.isSymbolicLink()) type = 'symlink';
                    return {
                        Name: dirent.name,
                        Type: type,
                    };
                })
                .sort((a, b) => a.Type < b.Type ? -1 : 1);
            console.table(tableDirContent);
        } else {
            print('The directory is empty.');
        }
    } catch {
        print(OPERATION_FAILED_ERROR);
    }
}

export default handleNavigationCommand;
