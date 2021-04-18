import * as AWS from "aws-sdk";

interface OperationsConfig {
  tableName: string;
  region: string;
}

class Operations {
  private config: OperationsConfig;

  constructor(config: OperationsConfig) {
    this.config = config;
  }

  // eslint-disable-next-line
  private dynamo() {
    return new AWS.DynamoDB({
      apiVersion: "2012-08-10",
      region: this.config.region,
    });
  }

  // eslint-disable-next-line
  public getItem(key: string): Promise<object> {
    const tableName = this.config.tableName;

    const params = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return this.dynamo()
      .getItem(params)
      .promise()
      .then((response) => JSON.parse(response.Item.JSON.S));
  }

  // eslint-disable-next-line
  public putItem(key: string, data: object): Promise<void> {
    const tableName = this.config.tableName;

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

    return this.dynamo()
      .putItem(params)
      .promise()
      .then(() => {
        return;
      });
  }

  public removeItem(key: string): Promise<void> {
    const tableName = this.config.tableName;

    const params = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return this.dynamo()
      .deleteItem(params)
      .promise()
      .then(() => {
        return;
      });
  }
}

export default Operations;
