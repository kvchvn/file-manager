import { homedir } from 'os';
import { getLocation, greet } from './messages.js';

export const print = (content = '') => {
    process.stdout.write(content + '\n');
};

export const goToNextLine = () => print();

export const moveToHomedir = (username) => {
    try {
        process.chdir(homedir());
        greet(username);
        getLocation();
    } catch (err) {
        print(err.message);
    }
};
