import handleNavigationCommand from './navigation.js';
import { INVALID_INPUT_ERROR, NAVIGATION_COMMANDS_LIST } from "../constants.js";
import { getLocation } from "../messages.js";

const parseCommandArgs = (argsArray) => {
    if (!argsArray || !argsArray.length) return null;
    const argsString = argsArray.join(' ');
    const separator = argsString.includes('"') ? '"' : ' ';
    return argsString.split(separator).map((arg) => arg.trim()).filter((arg) => arg);
};

const handleCommand = async (command) => {
    const [mainCommand, ...argsArray] = command.toLowerCase().split(' ');
    const parsedArgsArray = parseCommandArgs(argsArray);

    const commandsMap = new Map([
        [NAVIGATION_COMMANDS_LIST, handleNavigationCommand]
    ]);
    const commandsMapEntries = commandsMap.entries();
    let commandIsValid = false;

    Array.from(commandsMapEntries).forEach(async ([commandsList, handler]) => {
       if (commandsList.includes(mainCommand)) {
           commandIsValid = true;
           await handler(mainCommand, parsedArgsArray);
           getLocation();
       }
    });

    if (!commandIsValid) throw new Error(INVALID_INPUT_ERROR + ' Command is wrong.');
};

export default handleCommand;