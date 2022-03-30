import * as stream from "stream";

import DynamoDB from "./aws/dynamodb";
import S3 from "./aws/s3";
import { whatever } from "./types";

type OperationsConfig = {
  tableName: string;
  region: string;
};

class Operations {
  private static config(): OperationsConfig {
    return {
      tableName: process.env.STORAGE_TABLE_NAME,
      region: process.env.AWS_REGION,
    };
  }

  public static createTable(
    tableName: string,
    wait = false
  ): Promise<whatever> {
    if (wait) return DynamoDB.waitCreate(tableName);
    return DynamoDB.create(tableName);
  }

  public static removeTable(
    tableName: string,
    wait = false
  ): Promise<whatever> {
    if (wait) return DynamoDB.waitRemove(tableName);
    return DynamoDB.remove(tableName);
  }

  public static createBucket(name: string, wait = false): Promise<whatever> {
    if (wait) return S3.waitCreate(name);
    return S3.create(name);
  }

  public static removeBucket(name: string, wait = false): Promise<whatever> {
    if (wait) return S3.waitRemove(name);
    return S3.remove(name);
  }

  public static upload(key: string, data: whatever): Promise<string> {
    return S3.upload(key, data);
  }

  public static uploadFile(key: string, file: string): Promise<string> {
    return S3.uploadFile(key, file);
  }

  public static downloadStream(key: string): stream.Stream {
    return S3.downloadStream(key);
  }

  public static downloadSelect(key: string, opt: whatever): Promise<Buffer> {
    return S3.downloadSelect(key, opt);
  }

  public static purgeTable(tableName: string): Promise<string> {
    return DynamoDB.purge(tableName);
  }

  public static existsTable(tableName: string): Promise<boolean> {
    return DynamoDB.existsTable(tableName);
  }

  public static hasData(
    key: string | string[],
    tableName?: string
  ): Promise<boolean> {
    const name = tableName || Operations.config().tableName;
    return DynamoDB.existsKey(name, key);
  }

  public static getData(
    key: string | string[],
    tableName?: string
  ): Promise<whatever> {
    const name = tableName || Operations.config().tableName;
    return DynamoDB.getData(name, key);
  }

  public static putData(
    key: string,
    data: whatever | whatever[],
    tableName?: string
  ): Promise<void> {
    const name = tableName || Operations.config().tableName;
    return DynamoDB.waitCreate(name).then(() =>
      DynamoDB.putData(name, key, data)
    );
  }

  public static removeData(
    key: string | string[],
    tableName?: string
  ): Promise<void> {
    const name = tableName || Operations.config().tableName;
    return DynamoDB.removeData(name, key);
  }

  // legacy support
  public static hasItem(
    key: string | string[],
    tableName?: string
  ): Promise<boolean> {
    return Operations.hasData(key, tableName);
  }

  // legacy support
  public static hasItems(
    key: string | string[],
    tableName?: string
  ): Promise<boolean> {
    return Operations.hasData(key, tableName);
  }

  // legacy support
  public static getItem(
    key: string | string[],
    tableName?: string
  ): Promise<whatever> {
    return Operations.getData(key, tableName);
  }

  // legacy support
  public static getItems(
    key: string | string[],
    tableName?: string
  ): Promise<whatever> {
    return Operations.getData(key, tableName);
  }

  // legacy support
  public static putItem(
    key: string,
    data: whatever | whatever[],
    tableName?: string
  ): Promise<void> {
    return Operations.putData(key, data, tableName);
  }

  // legacy support
  public static putItems(
    key: string,
    data: whatever | whatever[],
    tableName?: string
  ): Promise<void> {
    return Operations.putData(key, data, tableName);
  }

  // legacy support
  public static removeItem(
    key: string | string[],
    tableName?: string
  ): Promise<void> {
    return Operations.removeData(key, tableName);
  }

  // legacy support
  public static removeItems(
    key: string | string[],
    tableName?: string
  ): Promise<void> {
    return Operations.removeData(key, tableName);
  }
}

export default Operations;
