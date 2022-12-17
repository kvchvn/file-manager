import { createReadStream, createWriteStream } from 'fs';
import { appendFile, rename, access, rm } from 'fs/promises';
import { join, parse, resolve, format } from 'path';

import { INVALID_ARGUMENTS_ERROR } from '../constants.js';
import { goToNextLine, print } from '../utils.js';

const handleFileCommand = async (mainCommand, argsArray) => {
    switch (mainCommand) {
        case 'cat': await readFile(argsArray)
            break;
        case 'add': await addFile(argsArray)
            break;
        case 'rn': await renameFile(argsArray)
            break;
        case 'cp': await copyFile(argsArray)
            break;
        case 'mv': await moveFile(argsArray)
            break;
        case 'rm': await removeFile(argsArray)
            break;
    }
};

async function readFile(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const [filePath] = argsArray;
        const resolvedFilePath = resolve(filePath);
        const rs = createReadStream(resolvedFilePath);

        await new Promise((resolve, reject) => {
            rs.on('end', () => {
                goToNextLine();
                rs.unpipe(process.stdout);
                resolve();
            });
            rs.on('error', reject);
            rs.pipe(process.stdout);
        }).catch((err) => {
            throw err;
        });
    } catch (err) {
        throw err;
    }
}

async function addFile(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const EMPTY_DATA = '';

        const [filePath] = argsArray;
        const resolvedFilePath = resolve(filePath);

        await appendFile(resolvedFilePath, EMPTY_DATA, { flag: 'ax' });
        print('The file was successfully created.');
    } catch (err) {
        throw err;
    }
}

async function renameFile(argsArray) {
    const [filePath, newFilename] = argsArray;
    if (argsArray.length !== 2  || newFilename.includes('/')) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const resolvedFilePath = resolve(filePath);
        const parsedFilePath = parse(resolvedFilePath);
        const newFilePath = format({ ...parsedFilePath, base: newFilename });

        await rename(resolvedFilePath, newFilePath);
        print('The file was successfully renamed.');
    } catch (err) {
        throw err;
    }
}

async function copyFile(argsArray, { shouldRemoveSourceFile } = { shouldRemoveSourceFile: false }) {
    const [filePath, dirForCopy] = argsArray;
    if (argsArray.length !== 2) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const fileName = parse(filePath).base;
        const resolvedFilePath = resolve(filePath);
        const resolvedDirForCopy = resolve(dirForCopy);
        const pathForCopy = join(resolvedDirForCopy, fileName);

        await Promise.all([access(resolvedFilePath), access(resolvedDirForCopy)]);

        await new Promise((resolve, reject) => {
            const rs = createReadStream(resolvedFilePath);
            const ws = createWriteStream(pathForCopy, { flags: 'wx' });

            const handleError = (err) => {
                rs.unpipe(ws);
                reject(err);
            }

            rs.on('end', () => {
                rs.unpipe(ws);
                resolve();
            });
            rs.on('error', handleError);
            ws.on('error', handleError);
            rs.pipe(ws);
        }).catch((err) => {
            throw err;
        });

        if (shouldRemoveSourceFile) {
            await rm(resolvedFilePath);
        }

        print(`The file was successfully ${shouldRemoveSourceFile ? 'moved' : 'copied'}.`);
    } catch (err) {
        throw err;
    }
}

async function moveFile(argsArray) {
    return await copyFile(argsArray, { shouldRemoveSourceFile: true });
}

async function removeFile(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const [filePath] = argsArray;
        const resolvedFilePath = resolve(filePath);

        await rm(resolvedFilePath);

        print('The file was successfully removed.');
    } catch (err) {
        throw err;
    }
}

export default handleFileCommand;