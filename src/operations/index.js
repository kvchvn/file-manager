import {
    FILES_COMMANDS_LIST,
    HASH_COMMANDS_LIST,
    INVALID_INPUT_ERROR,
    NAVIGATION_COMMANDS_LIST,
    OS_COMMANDS_LIST
} from '../constants.js';
import handleFileCommand from './file.js';
import handleNavigationCommand from './navigation.js';
import handleOsCommand from "./os.js";
import { getLocation } from '../messages.js';
import { print } from '../utils.js';
import handleHashCommand from "./hash.js";

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
        throw new Error(INVALID_INPUT_ERROR + ' from parsedFunction');
    }
    
    return parsedCommandArray;
};

const handleCommand = async (commandLine) => {
    const [mainCommand, ...argsArray] = parseCommandArgs(commandLine);
    const commandsMap = new Map([
        [NAVIGATION_COMMANDS_LIST, handleNavigationCommand],
        [FILES_COMMANDS_LIST, handleFileCommand],
        [OS_COMMANDS_LIST, handleOsCommand],
        [HASH_COMMANDS_LIST, handleHashCommand]
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
        if (!commandIsValid) throw new Error(INVALID_INPUT_ERROR + ' The command does not exist.');
    } catch (err) {
        print(err.message);
    } finally {
        getLocation();
    }
};

export default handleCommand;