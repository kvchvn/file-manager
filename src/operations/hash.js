import { access } from 'fs/promises';
import { createReadStream } from 'fs';
import { resolve } from 'path';
const { createHash } = await import('crypto');

import { ERROR_TYPES, INVALID_INPUT_ERROR, OPERATION_FAILED_ERROR } from '../constants.js';
import {goToNextLine, print} from '../utils.js';

const handleHashCommand = async (mainCommand, argsArray) => {
    switch (mainCommand) {
        case 'hash': await calculateHash(argsArray)
            break;
    }
};

async function calculateHash(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_INPUT_ERROR);
    try {
        const [filename] = argsArray;
        const currentDir = process.cwd();
        const resolvedFilePath = resolve(currentDir, filename);

        await access(resolvedFilePath);

        await new Promise((resolve, reject) => {
            const readStream = createReadStream(resolvedFilePath);
            const hash = createHash('sha256').setEncoding('hex');
            readStream.on('error', reject);
            hash.on('end', () => {
                goToNextLine();
                resolve();
                readStream.unpipe(hash);
                hash.unpipe(process.stdout);
            });
            readStream.pipe(hash).pipe(process.stdout);
        });
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

export default handleHashCommand;
