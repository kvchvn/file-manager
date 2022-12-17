import { readdir } from 'fs/promises';
import { dirname, resolve } from 'path';

import { INVALID_ARGUMENTS_ERROR } from '../constants.js';
import { print } from '../utils.js';

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
    if (argsArray.length) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const upperDir = dirname(process.cwd());
        process.chdir(upperDir);
    } catch (err) {
       throw err;
    }
}

function changeDir(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const [dirName] = argsArray;
        const newDir = resolve(dirName);
        process.chdir(newDir);
    } catch (err) {
        throw err;
    }
}

async function readCurrentDir(argsArray) {
    if (argsArray.length) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const dirContent = await readdir(process.cwd(), { withFileTypes: true });
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
                .sort((a, b) => {
                    if (a.Type < b.Type) {
                        return -1;
                    }
                    if (a.Type === b.Type && a.Name < b.Name) {
                        return -1;
                    }
                    return 1;
                });
            console.table(tableDirContent);
        } else {
            print('The directory is empty.');
        }
    } catch (err) {
        throw err;
    }
}

export default handleNavigationCommand;
