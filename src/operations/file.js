import { createReadStream, createWriteStream } from 'fs';
import { appendFile, rename, access, rm } from 'fs/promises';
import { join, parse, resolve, format } from 'path';

import { INVALID_INPUT_ERROR, OPERATION_FAILED_ERROR, ERROR_TYPES } from '../constants.js';
import { print, goToNextLine } from '../utils.js';

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
    if (argsArray.length !== 1) throw new Error(INVALID_INPUT_ERROR);
    try {
        const [filePath] = argsArray;
        const currentDir = process.cwd();
        const resolvedFilePath = resolve(currentDir, filePath);
        const rs = createReadStream(resolvedFilePath);

        await new Promise((resolve, reject) => {
            rs.on('end', () => {
                goToNextLine();
                resolve();
                rs.unpipe(process.stdout);
            });
            rs.on('error', reject);
            rs.pipe(process.stdout);
        });
    } catch (err) {
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.ENOENT: message +=  ' Such file was not found.'
                break;
            case ERROR_TYPES.EPERM: message += ' You do not have required permissions.'
                break;
        }
        print(message);
    }
}

async function addFile(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_INPUT_ERROR);
    try {
        const EMPTY_DATA = '';

        const [filename] = argsArray;
        const currentDir = process.cwd();
        const filePath = join(currentDir, filename);

        await appendFile(filePath, EMPTY_DATA, { flag: 'ax' });
        print('The file was successfully created.');
    } catch (err) {
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.EEXIST: message += ' File already exists.'
                break;
            case ERROR_TYPES.ENOENT: message += ' File`s name consists invalid symbols.'
                break;
            case ERROR_TYPES.EPERM: message += ' You do not have required permissions.'
                break;
        }
        print(message);
    }
}

async function renameFile(argsArray) {
    const [filePath, newFilename] = argsArray;
    if (argsArray.length !== 2  || newFilename.includes('/')) throw new Error(INVALID_INPUT_ERROR);
    try {
        const currentDir = process.cwd();
        const resolvedFilePath = resolve(currentDir, filePath);
        const parsedFilePath = parse(resolvedFilePath);
        const newFilePath = format({ ...parsedFilePath, base: newFilename });

        await rename(resolvedFilePath, newFilePath);
        print('The file was successfully renamed.');
    } catch (err) {
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.ENOENT: message += ' Such file was not found.';
                break;
            case ERROR_TYPES.EPERM: message += ' You do not have required permissions.'
                break;
        }
        print(message);
    }
}

async function copyFile(argsArray, { shouldRemoveSourceFile } = { shouldRemoveSourceFile: false }) {
    const [filePath, dirForCopy] = argsArray;
    if (argsArray.length !== 2) throw new Error(INVALID_INPUT_ERROR);
    try {
        const fileName = parse(filePath).base;
        const currentDir = process.cwd();
        const resolvedFilePath = resolve(currentDir, filePath);
        const resolvedDirForCopy = resolve(currentDir, dirForCopy);
        const pathForCopy = join(resolvedDirForCopy, fileName);

        await access(resolvedFilePath);

        const copyPromise = new Promise((resolve, reject) => {
            const rs = createReadStream(resolvedFilePath);
            const ws = createWriteStream(pathForCopy, { flags: 'wx' });

            rs.on('end', () => {
                resolve();
                rs.unpipe(ws);
            });

            rs.on('error', reject);
            ws.on('error', reject);
            rs.pipe(ws);
        });
        const removePromise = shouldRemoveSourceFile && rm(resolvedFilePath);

        await Promise.all([copyPromise, removePromise]);

        print(`The file was successfully ${shouldRemoveSourceFile ? 'moved' : 'copied'}.`);
    } catch (err) {
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.ENOENT: message += ' Such file or directory was not found.'
                break;
            case ERROR_TYPES.EEXIST: message += ' Such file already exists.'
                break;
            case ERROR_TYPES.EPERM: message += ' You do not have required permissions.'
                break;
        }
        print(message);
    }
}

async function moveFile(argsArray) {
    return await copyFile(argsArray, { shouldRemoveSourceFile: true });
}

async function removeFile(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_INPUT_ERROR);
    try {
        const [filename] = argsArray;
        const currentDir = process.cwd();
        const filePath = resolve(currentDir, filename);

        await rm(filePath);

        print('The file was successfully removed.');
    } catch (err) {
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.ENOENT: message += ' Such file was not found.'
                break;
            case ERROR_TYPES.EPERM: message += ' You do not have required permissions.'
                break;
        }
        print(message);
    }
}

export default handleFileCommand;