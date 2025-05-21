import { ERROR, ERROR_DESC_BY_CODE } from "../constants.js";

export const printError = (err) => {
  const description = ERROR_DESC_BY_CODE[err.code] ?? err.message;

  console.log(`${ERROR.operationFailed} ${description}`);
}