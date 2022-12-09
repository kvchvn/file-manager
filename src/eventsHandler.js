import { createInterface } from 'readline/promises';

import { formattedUsername as username, getLocation, sayGoodbye } from './messages.js';
import handleCommand from './operations/index.js';
import { print } from "./utils.js";

const readline = createInterface({ input: process.stdin });

process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', () => {
    sayGoodbye(username);
});

readline.on('line',  (line) => {
    if (line.includes('.exit')) {
        process.exit();
    }

    try {
        handleCommand(line);
    } catch (err) {
        const { message } = err;
        print(message);
    }
});