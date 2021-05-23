import * as AWS from "aws-sdk";

class DynamoDB {
  // eslint-disable-next-line
  private static dial(region: string = process.env.AWS_REGION || process.env.STORAGE_DEFAULT_REGION) {
    return new AWS.DynamoDB({
      apiVersion: "2012-08-10",
      region,
    });
  }

  public static create(tableName: string): Promise<string> {
    const config = {
      TableName: tableName,
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
        KMSMasterKeyId: process.env.STORAGE_KMS_KEY,
        SSEType: "KMS",
      },
    };

    return DynamoDB.dial()
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
  }

  public static remove(tableName: string): Promise<string> {
    const config = {
      TableName: tableName,
    };

    return DynamoDB.dial()
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
  }

  public static purge(tableName: string): Promise<string> {
    return Promise.reject(
      `[SERVERLESS STORAGE PURGE] not yet implemented; tableName : ${tableName}`
    );
  }

  public static existsTable(tableName: string): Promise<boolean> {
    const config = {
      TableName: tableName,
    };

    return DynamoDB.dial()
      .describeTable(config)
      .promise()
      .then((response) => response.Table.TableStatus === "ACTIVE")
      .catch((err) => {
        if (err.message.indexOf("resource not found: Table") > -1) {
          return Promise.resolve(false);
        }

        return Promise.reject(false);
      });
  }

  public static existsKey(tableName: string, key: string): Promise<boolean> {
    const config = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return DynamoDB.dial()
      .getItem(config)
      .promise()
      .then(
        (response) =>
          typeof response.Item !== "undefined" && response.Item !== null
      );
  }

  public static waitCreate(tableName: string): Promise<boolean> {
    const config = {
      TableName: tableName,
    };

    return DynamoDB.existsTable(tableName).then((exists) => {
      if (exists) return Promise.resolve(true);
      return Promise.resolve()
        .then(() => DynamoDB.create(tableName))
        .then(() => DynamoDB.dial().waitFor("tableExists", config).promise())
        .then((response) => response.Table.TableStatus === "ACTIVE");
    });
  }

  public static waitRemove(tableName: string): Promise<boolean> {
    const config = {
      TableName: tableName,
    };

    return DynamoDB.existsTable(tableName).then((exists) => {
      if (!exists) return Promise.resolve(true);
      return Promise.resolve()
        .then(() => DynamoDB.remove(tableName))
        .then(() => DynamoDB.dial().waitFor("tableNotExists", config).promise())
        .then(() => true);
    });
  }

  // eslint-disable-next-line
  public static getItem(tableName: string, key: string): Promise<object> {
    const params = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return DynamoDB.dial()
      .getItem(params)
      .promise()
      .then((response) => JSON.parse(response.Item.JSON.S));
  }

  // eslint-disable-next-line
  public static putItem(tableName: string, key: string, data: object): Promise<void> {
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

    return DynamoDB.dial()
      .putItem(params)
      .promise()
      .then(() => {
        return;
      });
  }

  public static removeItem(tableName: string, key: string): Promise<void> {
    const params = {
      Key: {
        ID: {
          S: key,
        },
      },
      TableName: tableName,
    };

    return DynamoDB.dial()
      .deleteItem(params)
      .promise()
      .then(() => {
        return;
      });
  }
}

export default DynamoDB;
