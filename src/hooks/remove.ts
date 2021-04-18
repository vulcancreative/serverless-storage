import * as AWS from "aws-sdk";

import { ServerlessInstance, ServerlessStorage } from "../types";

const buildConfig = (options: ServerlessStorage) => {
  return {
    TableName: options.tableName,
  };
};

// eslint-disable-next-line
const removeHook = (serverless: ServerlessInstance) => {
  const options = serverless.service.custom.serverlessStorage;
  const config = buildConfig(options);

  const db = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: serverless.providers.aws.getRegion() || options.defaultRegion,
  });

  return db
    .deleteTable(config)
    .promise()
    .then((response) => {
      const { TableName } = response.TableDescription;
      const message = `Successfully remove storage table "${TableName}"`;

      return message;
    })
    .catch((err) => {
      if (err.message.indexOf("not found") > -1) {
        return "Storage doesn't exist";
      }

      return `Failed to remove storage : ${err.message}`;
    });
};

export default removeHook;
