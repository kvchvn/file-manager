import fs from "node:fs";
import path from "node:path";
import streamPromises from "node:stream/promises";
import { createGunzip } from "node:zlib";

export const decompressFile = async (source, destination) => {
  const absSource = path.resolve(source);
  const absDestination = path.resolve(destination);

  await fs.promises.access(absSource);

  const rs = fs.createReadStream(absSource);
  const ws = fs.createWriteStream(absDestination, { flags: "wx" });
  const gz = createGunzip();

  await streamPromises.pipeline(rs, gz, ws);
};
