import DynamoDB from "../aws/dynamodb";
import { ServerlessInstance } from "../types";

const purgeHook = (serverless: ServerlessInstance): Promise<string> => {
  const options = serverless.service.custom.serverlessStorage;
  return DynamoDB.purge(options.tableName);
};

export default purgeHook;
