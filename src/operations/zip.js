import { createReadStream, createWriteStream } from 'fs';
import { access } from 'fs/promises';
import { dirname, resolve } from 'path';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress, constants } from 'zlib';

import { INVALID_ARGUMENTS_ERROR } from '../constants.js';
import { print } from '../utils.js';

const handleZipCommand = async (mainCommand, argsArray) => {
    switch (mainCommand) {
        case 'compress': await compressFile(argsArray)
            break;
        case 'decompress': await decompressFile(argsArray)
            break;
    }
};

async function compressFile(argsArray) {
    if (argsArray.length !== 2) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const [filePath, archivePath] = argsArray;
        const resolvedFilePath = resolve(filePath);
        const resolvedArchivePath = resolve(archivePath);
        const resolvedArchiveDir = dirname(resolvedArchivePath);

        await Promise.all([access(resolvedFilePath), access(resolvedArchiveDir)]);

        const rs = createReadStream(resolvedFilePath);
        const ws = createWriteStream(resolvedArchivePath, { flags: 'wx' });
        const brotliCompression = createBrotliCompress({
            params: {
                [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MIN_QUALITY,
            }
        });

        await pipeline(rs, brotliCompression, ws)
            .then(() => print('The file was successfully compressed.'))
            .catch((err) => {
                throw err;
            });
    } catch (err) {
        throw err;
    }
}

async function decompressFile(argsArray) {
    if (argsArray.length !== 2) throw new Error(INVALID_ARGUMENTS_ERROR);
    try {
        const [archivePath, filePath] = argsArray;
        const resolvedArchivePath = resolve(archivePath);
        const resolvedFilePath = resolve(filePath);
        const resolvedFileDir = dirname(resolvedFilePath);

        await Promise.all([access(resolvedArchivePath), access(resolvedFileDir)]);

        const rs = createReadStream(resolvedArchivePath);
        const ws = createWriteStream(resolvedFilePath, { flags: 'wx' });
        const brotliDecompression = createBrotliDecompress();

        await pipeline(rs, brotliDecompression, ws)
            .then(() => print('The archive was successfully decompressed.'))
            .catch((err) => {
                throw err;
            });
    } catch (err) {
        throw err;
    }
}

export default handleZipCommand;
