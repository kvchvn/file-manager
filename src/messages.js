import { STRANGER_NAME } from './constants.js';
import { print } from './utils.js';

const args = process.argv.slice(2);

const username = args.find((value) => value.includes('username'));

export const formattedUsername = username
    ? username.slice(username.indexOf('=') + 1).replace('_', ' ')
    : STRANGER_NAME;

export const getLocation = () => {
  print(`You are currently in ${process.cwd()}`);
};

export const greet = (username) => {
    print(`Welcome to the File Manager, ${username}!`);
};

export const sayGoodbye = (username) => {
    print(`Thank you for using File Manager, ${username}, goodbye!`);
};
