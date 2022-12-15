export const print = (content = '') => {
    process.stdout.write(content + '\n');
};

export const goToNextLine = () => print();
