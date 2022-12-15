import { homedir } from 'os';
import { createInterface } from 'readline/promises';

import { formattedUsername as username, greet, getLocation, sayGoodbye } from './messages.js';
import handleCommand from './operations/index.js';
import { goToNextLine, print } from './utils.js';

const moveToHomedir = () => {
    try {
        process.chdir(homedir());
        greet(username);
        getLocation();
    } catch (err) {
        print(err.message);
    }
};

const readline = createInterface({ input: process.stdin });

readline.on('line', (line) => {
    if (line.includes('.exit')) {
        process.exit();
    }

    if (line) {
        handleCommand(line)
            .catch((err) => print(err.message));
    } else {
        getLocation();
    }
});

process.on('SIGINT', () => {
    goToNextLine();
    process.exit();
});

process.on('exit', () => {
    sayGoodbye(username);
});

export default moveToHomedir;
