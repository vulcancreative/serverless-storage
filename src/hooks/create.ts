import * as AWS from "aws-sdk";

import { ServerlessInstance, ServerlessStorage } from "../types";

const buildConfig = (options: ServerlessStorage) => {
  return {
    TableName: options.tableName,
    AttributeDefinitions: [
      {
        AttributeName: "ID",
        AttributeType: "S",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [
      {
        AttributeName: "ID",
        KeyType: "HASH",
      },
    ],
    SSESpecification: {
      Enabled: true,
      KMSMasterKeyId: options.kmsKey,
      SSEType: "KMS",
    },
  };
};

// eslint-disable-next-line
const createHook = (serverless: ServerlessInstance) => {
  const options = serverless.service.custom.serverlessStorage;
  const config = buildConfig(options);

  const db = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: serverless.providers.aws.getRegion() || options.defaultRegion,
  });

  return db
    .createTable(config)
    .promise()
    .then((response) => {
      const { TableName } = response.TableDescription;
      const message = `Successfully created storage table "${TableName}"`;

      return message;
    })
    .catch((err) => {
      if (err.message.indexOf("Table already exists") > -1) {
        return "Storage already exists";
      }

      return `Failed to create storage : ${err.message}`;
    });
};

export default createHook;
