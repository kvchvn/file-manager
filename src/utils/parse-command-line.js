import { ERROR } from "../constants.js";

/**
 * @param line {string}
 * @returns {string[]}
 */
export const parseCommandLine = (line) => {
  const SPACE = ' ';
  const DOUBLE_QUOTE = '"';
  const parsedCommand = [];

  let quotesCount = 0;
  let inQuotes = false;
  let currentCommandOrArg = '';

  line.trim().split('').forEach((char) => {
    switch (char) {
      case SPACE: {
        if (inQuotes) {
          currentCommandOrArg += char;
        } else if (currentCommandOrArg) {
          parsedCommand.push(currentCommandOrArg);
          currentCommandOrArg = '';
        }
        break;
      }
      case DOUBLE_QUOTE: {
        quotesCount++;
        if (inQuotes && currentCommandOrArg) {
          parsedCommand.push(currentCommandOrArg);
          currentCommandOrArg = '';
        }
        inQuotes = !inQuotes;
        break;
      }
      default: {
        currentCommandOrArg += char;
      }
    }
  });

  if (currentCommandOrArg) {
    parsedCommand.push(currentCommandOrArg);
  }

  if (quotesCount % 2) {
    throw new Error(ERROR.invalidArgs);
  }

  return parsedCommand;
}