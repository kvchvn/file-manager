import fsPromises from "node:fs/promises";
import { ERROR } from "../../constants.js";

export const renameFile = async (oldFilename, newFilename) => {
  if (!oldFilename || !newFilename) {
    throw new Error(ERROR.invalidArgs);
  } else {
    await fsPromises.rename(oldFilename, newFilename);
  }
}