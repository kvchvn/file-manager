import fsPromises from "node:fs/promises";
import path from "node:path";

export const removeFile = async (filePath) => {
  const absPath = path.resolve(filePath);

  await fsPromises.rm(absPath);
};
