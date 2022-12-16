import { EOL, homedir, cpus, arch, hostname } from 'os';

import { INVALID_COMMAND_ERROR, INVALID_INPUT_ERROR } from '../constants.js';
import { print } from '../utils.js';

const handleOsCommand = (mainCommand, argsArray) => {
    switch (mainCommand) {
        case 'os': getOsInfo(argsArray)
            break;
    }
};

function getOsInfo(argsArray) {
    const [arg] = argsArray;
    if (argsArray.length !== 1 || !arg.startsWith('--') || !arg.slice(2)) throw new Error(INVALID_INPUT_ERROR);
    try {
        const formattedArg = arg.slice(2);
        switch (formattedArg) {
            case 'EOL': print(JSON.stringify(EOL).slice(1 ,-1))
                break;
            case 'cpus': {
                const cpusData = cpus();
                const cpusModelData = cpusData.map((cpu) => {
                    return {
                        Model: cpu.model.trim(),
                        Speed: `${(Number(cpusData[0].speed) / 1000).toFixed(1)} GHz`
                    };
                });
                print(`The machine has ${cpusData.length} logical cores.`);
                console.table(cpusModelData);
                break;
            }
            case 'homedir': print(homedir())
                break;
            case 'username': print(hostname())
                break;
            case 'architecture': print(arch())
                break;
            default: throw new Error(`${INVALID_INPUT_ERROR} ${INVALID_COMMAND_ERROR}`);
        }
    } catch (err) {
        throw err;
    }
}

export default handleOsCommand;
