import * as AWS from "aws-sdk";

import { ServerlessInstance, ServerlessStorage } from "../types";

const buildConfig = (options: ServerlessStorage) => {
  return {
    TableName: options.tableName,
  };
};

// eslint-disable-next-line
const infoHook = (serverless: ServerlessInstance) => {
  const options = serverless.service.custom.serverlessStorage;
  const config = buildConfig(options);

  const db = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: serverless.providers.aws.getRegion() || options.defaultRegion,
  });

  return db
    .describeTable(config)
    .promise()
    .then((response) => {
      const status = response.Table.TableStatus.toLowerCase();
      const tableName = response.Table.TableName;

      if (status === "active") {
        return `Storage is ready in table "${tableName}"`;
      }

      return `Storage status of table "${tableName}" is "${status}"`;
    })
    .catch(() => "Storage doesn't exist");
};

export default infoHook;
