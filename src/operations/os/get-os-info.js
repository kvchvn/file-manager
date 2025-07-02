import os from "node:os";
import { ERROR } from "../../constants.js";

export const getOsInfo = (arg) => {
  switch (arg) {
    case "--EOL":
      console.log(JSON.stringify(os.EOL));
      break;
    case "--cpus":
      console.log("Count of CPUs: ", os.cpus().length);
      const table = os.cpus().map((cpu) => ({
        Model: cpu.model.trim(),
        "Clock rate (GHz)": (cpu.speed / 1000).toFixed(1),
      }));
      console.table(table);
      break;
    case "--homedir":
      console.log(os.homedir());
      break;
    case "--architecture":
      console.log(os.arch());
      break;
    case "--username":
      console.log(os.userInfo().username);
      break;
    default:
      throw new Error(ERROR.invalidArgs, { cause: ERROR.invalidInput });
  }
};
