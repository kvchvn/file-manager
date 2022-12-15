import { relative, resolve, parse, format } from 'path';

export const print = (content = '') => {
    process.stdout.write(content + '\n');
};

export const goToNextLine = () => print();

export const resolvePaths = (currentPath, newPath) => {
    const relativePath = relative(currentPath, newPath);
    return resolve(relativePath);
};

export const changeBasename = (path, newBasename) => {
    const parsedPath = parse(path);
    parsedPath.base = newBasename;
    return format(parsedPath);
}
