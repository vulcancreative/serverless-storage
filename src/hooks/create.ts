import DynamoDB from "../aws/dynamodb";
import { ServerlessInstance } from "../types";

const createHook = (serverless: ServerlessInstance): Promise<string> => {
  const options = serverless.service.custom.serverlessStorage;
  return DynamoDB.create(options.tableName);
};

export default createHook;
