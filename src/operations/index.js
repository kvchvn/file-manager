import handleFileCommand from './file.js';
import handleHashCommand from './hash.js';
import handleNavigationCommand from './navigation.js';
import handleOsCommand from './os.js';
import handleZipCommand from './zip.js';

import { COMMANDS_LIST, ERROR_TYPES, OPERATION_FAILED_ERROR, INVALID_COMMAND_ERROR, INVALID_NAME_ERROR } from '../constants.js';
import { getLocation } from '../messages.js';
import { print } from '../utils.js';

const parseCommandArgs = (commandLine) => {
    const SPACE = ' ';
    const DOUBLE_QUOTE = '"';

    let currentArg = '';
    const parsedCommandArray = [];

    let quotesCount = 0;
    let inQuotes = false;

    commandLine.trim().split('').forEach((char, index, arr) => {
        if (char === SPACE) {
            if (inQuotes) {
                currentArg += char;
            } else {
                // there should be gaps between arguments
                currentArg && parsedCommandArray.push(currentArg);
                currentArg = '';
            }
        } else if (char === DOUBLE_QUOTE) {
            quotesCount++;
            inQuotes = !inQuotes;
            if (currentArg) {
                parsedCommandArray.push(currentArg);
                currentArg = '';
            }
        } else {
            // if char is neither space nor double quote
            currentArg += char;
        }

        if (index === arr.length - 1 && currentArg) {
            currentArg && parsedCommandArray.push(currentArg);
        }
    });

    if (quotesCount % 2 !== 0) {
        throw new Error(INVALID_NAME_ERROR);
    }
    
    return parsedCommandArray;
};

const handleCommand = async (commandLine) => {
    const [mainCommand, ...argsArray] = parseCommandArgs(commandLine);
    const commandsMap = new Map([
        [COMMANDS_LIST.navigation, handleNavigationCommand],
        [COMMANDS_LIST.file, handleFileCommand],
        [COMMANDS_LIST.os, handleOsCommand],
        [COMMANDS_LIST.hash, handleHashCommand],
        [COMMANDS_LIST.zip, handleZipCommand]
    ]);
    const commandsMapEntries = commandsMap.entries();
    const commandsEntriesArray = Array.from(commandsMapEntries);

    try {
        let commandIsValid = false;
        for (const [commandList, callback] of commandsEntriesArray) {
            if (commandList.includes(mainCommand)) {
                commandIsValid = true;
                await callback(mainCommand, argsArray);
            }
        }
        if (!commandIsValid) throw new Error(INVALID_COMMAND_ERROR);
    } catch (err) {
        if (!err.code) {
            print(err.message);
            return;
        }
        let message = OPERATION_FAILED_ERROR;
        switch (err.code) {
            case ERROR_TYPES.notPermit.code: message += ` ${ERROR_TYPES.notPermit.message}`
                break;
            case ERROR_TYPES.notExist.code: message += ` ${ERROR_TYPES.notExist.message}`
                break;
            case ERROR_TYPES.alreadyExist.code: message += ` ${ERROR_TYPES.alreadyExist.message}`
                break;
            case ERROR_TYPES.invalidArgs.code: message += ` ${ERROR_TYPES.invalidArgs.message}`
                break;
        }
        print(message);
    } finally {
        getLocation();
    }
};

export default handleCommand;