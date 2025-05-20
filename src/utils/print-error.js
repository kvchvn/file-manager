export const printError = (err) => {
  let description = '';

  switch (err.code) {
    case 'ENOENT':
      description = 'No such file or directory.';
    break;
  }

  console.log(`Operation failed! ${description}`);
}