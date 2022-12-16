export const STRANGER_NAME = 'Stranger';

export const OPERATION_FAILED_ERROR = 'Operation failed.';
export const INVALID_INPUT_ERROR = 'Invalid input.';
export const INVALID_COMMAND_ERROR = 'Such command does not exist.';

export const COMMANDS_LIST = {
    navigation: ['up', 'cd', 'ls'],
    file: ['cat', 'add', 'rn', 'cp', 'mv', 'rm'],
    os: ['os'],
    hash: ['hash'],
    zip: ['compress', 'decompress'],
};

export const ERROR_TYPES = {
    notExist: {
        code: 'ENOENT',
        message: 'Such file/directory was not found.',
    },
    alreadyExist: {
        code: 'EEXIST',
        message: 'File already exists.',
    },
    invalidArgs: {
        code: 'ERR_INVALID_ARG_TYPE',
        message: 'Name of file/directory should be a string.',
    },
    notPermit: {
        code: 'EPERM',
        message: 'You do not have required permissions.',
    },
};
