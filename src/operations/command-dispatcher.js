/**
 * @param line {string} Command line
 */
export const commandDispatcher = (line) => {
  const [baseCommand] = line.split(' ');

  try {
    switch (baseCommand) {
      default:
        console.log('Invalid input!');
    }
  } catch {
    console.log('Operation failed!');
  }
}