import DynamoDB from "./aws/dynamodb";

class Operations {
  private static config = {
    tableName: process.env.STORAGE_TABLE_NAME,
    region: process.env.AWS_REGION,
  };

  // eslint-disable-next-line
  public static getItem(key: string): Promise<object> {
    const tableName = Operations.config.tableName;
    return DynamoDB.getItem(tableName, key);
  }

  // eslint-disable-next-line
  public static putItem(key: string, data: object): Promise<void> {
    const tableName = Operations.config.tableName;
    return DynamoDB.waitCreate(tableName).then(() =>
      DynamoDB.putItem(tableName, key, data)
    );
  }

  public static removeItem(key: string): Promise<void> {
    const tableName = Operations.config.tableName;
    return DynamoDB.removeItem(tableName, key);
  }
}

export default Operations;
