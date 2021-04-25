import DynamoDB from "../aws/dynamodb";
import { ServerlessInstance } from "../types";

const removeHook = (serverless: ServerlessInstance): Promise<string> => {
  const options = serverless.service.custom.serverlessStorage;
  return DynamoDB.remove(options.tableName);
};

export default removeHook;
