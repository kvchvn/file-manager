import fsPromises from 'node:fs/promises';

export const readDir = async () => {
  const dirent = await fsPromises.readdir(process.cwd(), { withFileTypes: true });

  const table = dirent.map((entity) => {
    let type = '<unknown>';
    if (entity.isDirectory()) {
      type = 'directory';
    } else if (entity.isFile()) {
      type = 'file';
    } else if (entity.isSymbolicLink()) {
      type = 'symbolic link';
    }

    return {
      Name: entity.name,
      Type: type,
    };
  });

  console.table(table);
}