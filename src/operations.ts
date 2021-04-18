import * as AWS from "aws-sdk";

import createHook from "./hooks/create";
import removeHook from "./hooks/remove";
import { ServerlessInstance } from "./types";

class Operations {
  public static serverless: ServerlessInstance;

  // eslint-disable-next-line
  private static dynamo() {
    const opts = Operations.serverless.service.custom.serverlessStorage;
    const region = Operations.serverless.providers.aws.getRegion();

    return new AWS.DynamoDB({
      apiVersion: "2012-08-10",
      region: region || opts.defaultRegion,
    });
  }

  // eslint-disable-next-line
  public static getItem(key: string): Promise<object> {
    const opts = Operations.serverless.service.custom.serverlessStorage;
    const tableName = opts.tableName;

    const params = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return Operations.dynamo()
      .getItem(params)
      .promise()
      .then((response) => JSON.parse(response.Item.JSON.S));
  }

  // eslint-disable-next-line
  public static putItem(key: string, data: object): Promise<void> {
    const opts = Operations.serverless.service.custom.serverlessStorage;
    const tableName = opts.tableName;

    const params = {
      Item: {
        ID: {
          S: key,
        },
        JSON: {
          S: JSON.stringify(data),
        },
        UpdatedAt: {
          S: `${new Date().toUTCString()}`,
        },
      },
      TableName: tableName,
    };

    return Operations.dynamo()
      .putItem(params)
      .promise()
      .then(() => {
        return;
      });
  }

  public static removeItem(key: string): Promise<void> {
    const opts = Operations.serverless.service.custom.serverlessStorage;
    const tableName = opts.tableName;

    const params = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return Operations.dynamo()
      .deleteItem(params)
      .promise()
      .then(() => {
        return;
      });
  }

  public static clear(): Promise<void> {
    return removeHook(Operations.serverless)
      .then(() => createHook(Operations.serverless))
      .then(() => {
        return;
      });
  }
}

export default Operations;
