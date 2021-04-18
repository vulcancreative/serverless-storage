import { ServerlessInstance } from "../types";

const purgeHook = (serverless: ServerlessInstance): void => {
  serverless.cli.log("[SERVERLESS STORAGE PURGE]");
};

export default purgeHook;
