import fsPromises from "node:fs/promises";

export const readDir = async () => {
  const dirent = await fsPromises.readdir(process.cwd(), { withFileTypes: true });

  const table = dirent.map((entity) => {
    let type = "<unknown>";

    switch (true) {
      case entity.isDirectory():
        type = "directory";
        break;
      case entity.isFile():
        type = "file";
        break;
      case entity.isSymbolicLink():
        type = "symbolic link";
    }

    return {
      Name: entity.name,
      Type: type,
    };
  });

  console.table(table);
};
