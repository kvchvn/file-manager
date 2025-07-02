import fsPromises from "node:fs/promises";
import path from "node:path";
import { ERROR } from "../../constants.js";

export const renameFile = async (oldPath, newPath) => {
  const absOldPath = path.resolve(oldPath);
  const absNewPath = path.resolve(newPath);

  if (!absOldPath || !absNewPath) {
    throw new Error(ERROR.invalidArgs);
  } else {
    await fsPromises.rename(absOldPath, absNewPath);
  }
};
