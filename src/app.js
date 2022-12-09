import { homedir } from 'os';
import { print } from './utils.js';

import { formattedUsername as username, greet, getLocation } from './messages.js';
import './eventsHandler.js';

const runFileManager = () => {
    try {
        process.chdir(homedir());
        greet(username);
        getLocation();
    } catch (err) {
        print(err);
    }
};

export default runFileManager;
