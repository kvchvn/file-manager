import { createInterface } from 'readline';

import { formattedUsername as username, getLocation, sayGoodbye } from './messages.js';
import handleCommand from './operations/index.js';
import { goToNextLine, print, moveToHomedir } from './utils.js';

moveToHomedir(username);

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
