import fs from "node:fs";
import path from "node:path";
import streamPromises from "node:stream/promises";

export const copyFile = async (source, destination) => {
  const absSource = path.resolve(source);
  const absDestination = path.resolve(destination);

  const rs = fs.createReadStream(absSource);
  const ws = fs.createWriteStream(absDestination, { flags: "wx" });

  await streamPromises.pipeline(rs, ws);
};
