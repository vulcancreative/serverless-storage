import DynamoDB from "../aws/dynamodb";
import S3 from "../aws/s3";
import { ServerlessInstance, whatever } from "../types";

const removeHook = (
  serverless: ServerlessInstance
): Promise<[string | void, string | void]> => {
  const options = serverless.service.custom.serverlessStorage as whatever;

  const a = options.tableName
    ? DynamoDB.remove(options.tableName)
    : Promise.resolve();

  const b = options.bucketName
    ? S3.remove(options.bucketName)
    : Promise.resolve();

  return Promise.all([a, b]);
};

export default removeHook;
