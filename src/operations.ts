import * as AWS from "aws-sdk";

interface OperationsConfig {
  tableName: string;
  region: string;
}

class Operations {
  public static config: OperationsConfig;

  // eslint-disable-next-line
  private static dynamo() {
    return new AWS.DynamoDB({
      apiVersion: "2012-08-10",
      region: Operations.config.region,
    });
  }

  // eslint-disable-next-line
  public static getItem(key: string): Promise<object> {
    const tableName = Operations.config.tableName;

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
    const tableName = Operations.config.tableName;

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
    const tableName = Operations.config.tableName;

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
}

export default Operations;
