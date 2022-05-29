import DynamoDB from "../aws/dynamodb";
import S3 from "../aws/s3";
import { ServerlessInstance, whatever } from "../types";

const createHook = (
  serverless: ServerlessInstance,
  options: whatever
): Promise<[string | void, string | void]> => {
  const config = serverless.service.custom.serverlessStorage as whatever;

  const tableName = options.tableName || config.tableName || null;
  const bucketName = options.bucketName || config.bucketName || null;

  const a = tableName ? DynamoDB.create(tableName) : Promise.resolve();
  const b = bucketName ? S3.create(bucketName) : Promise.resolve();

  return Promise.all([a, b]);
};

export default createHook;
