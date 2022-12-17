const { createHash } = await import('crypto');
import { createReadStream } from 'fs';
import { resolve } from 'path';

import { INVALID_ARGUMENTS_ERROR } from '../constants.js';
import { goToNextLine } from '../utils.js';

const handleHashCommand = async (mainCommand, argsArray) => {
    switch (mainCommand) {
        case 'hash': await calculateHash(argsArray)
            break;
    }
};

async function calculateHash(argsArray) {
    if (argsArray.length !== 1) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const [filename] = argsArray;
        const currentDir = process.cwd();
        const resolvedFilePath = resolve(currentDir, filename);

        await new Promise((resolve, reject) => {
            const rs = createReadStream(resolvedFilePath);
            const hash = createHash('sha256').setEncoding('hex');
            const handleError = (err) => {
                rs.unpipe();
                reject(err);
            };
            rs.on('error', handleError);
            hash.on('error', handleError);
            hash.on('end', () => {
                goToNextLine();
                rs.unpipe();
                resolve();
            });
            rs.pipe(hash).pipe(process.stdout);
        }).catch((err) => {
            throw err;
        });
    } catch (err) {
        throw err;
    }
}

export default handleHashCommand;
