import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const calcHash = async (filePath) => {
  const absPath = path.resolve(filePath);
  const rs = fs.createReadStream(absPath);
  const hash = crypto.createHash("sha256", { encoding: "hex" });

  rs.pipe(hash);

  await new Promise((resolve, reject) => {
    hash.on("data", (data) => {
      process.stdout.write(data);
    });
    hash.on("end", () => {
      process.stdout.write("\n");
      resolve();
    });
    hash.on("error", reject);
  });
};
