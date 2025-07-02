import { ERROR, ERROR_DESC_BY_CODE } from "../constants.js";

export const printError = (err) => {
  if (err.cause === ERROR.invalidInput) {
    console.log(err.message);
  } else {
    const description = ERROR_DESC_BY_CODE[err.code] ?? "";

    console.log(`${ERROR.operationFailed}${description ? ` ${description}` : ""}`);
  }
};
