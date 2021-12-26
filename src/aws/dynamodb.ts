import * as AWS from "aws-sdk";

import { whatever } from "../types";

const loc = process.env.AWS_REGION || process.env.STORAGE_DEFAULT_REGION;

class DynamoDB {
  private static dial(region: string = loc): whatever {
    return new AWS.DynamoDB({
      apiVersion: "2012-08-10",
      region,
    });
  }

  public static async create(tableName: string): Promise<string> {
    const kmsKey = process.env.STORAGE_KMS_KEY;
    const hasKey = !!kmsKey;

    const config = {
      TableName: tableName,
      AttributeDefinitions: [
        {
          AttributeName: "PK",
          AttributeType: "S",
        },
        {
          AttributeName: "ID",
          AttributeType: "S",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
      KeySchema: [
        {
          AttributeName: "PK",
          KeyType: "HASH",
        },
        {
          AttributeName: "ID",
          KeyType: "RANGE",
        },
      ],
      ...(hasKey
        ? {
            SSESpecification: {
              Enabled: true,
              KMSMasterKeyId: kmsKey,
              SSEType: "KMS",
            },
          }
        : {}),
    };

    try {
      const response = await DynamoDB.dial().createTable(config).promise();
      const { TableName } = response.TableDescription;
      const message = `Successfully created storage table "${TableName}"`;

      return message;
    } catch (err) {
      if (err.message.indexOf("Table already exists") > -1) {
        return "Storage already exists";
      }

      return `Failed to create storage : ${err.message}`;
    }
  }

  public static async remove(tableName: string): Promise<string> {
    const config = {
      TableName: tableName,
    };

    try {
      const response = await DynamoDB.dial().deleteTable(config).promise();
      const { TableName } = response.TableDescription;
      const message = `Successfully remove storage table "${TableName}"`;

      return message;
    } catch (err) {
      if (err.message.indexOf("not found") > -1) {
        return "Storage doesn't exist";
      }

      return `Failed to remove storage : ${err.message}`;
    }
  }

  public static async purge(tableName: string): Promise<string> {
    const res = await Promise.reject(
      `[SERVERLESS STORAGE PURGE] not yet implemented; ` +
        `tableName : ${tableName}`
    );

    return res;
  }

  public static async existsTable(tableName: string): Promise<boolean> {
    const config = {
      TableName: tableName,
    };

    try {
      const response = await DynamoDB.dial().describeTable(config).promise();
      const res = response.Table.TableStatus === "ACTIVE";
      return res;
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);

      if (err.message.indexOf("resource not found: Table") > -1) {
        return false;
      }

      return false;
    }
  }

  public static async existsKey(
    tableName: string,
    key: string | string[]
  ): Promise<boolean> {
    if (Array.isArray(key)) throw "Arrays not supported in existsKey";
    if (!DynamoDB.validKey(key)) throw `Key "${key}" is invalid`;

    const keyParts = key.split(":");
    const pk = keyParts[0];
    const id = keyParts.slice(1).join(":");

    const params = {
      Key: {
        PK: {
          S: pk,
        },
        ID: {
          S: id,
        },
      },
      TableName: tableName,
    };

    if (DynamoDB.verboseMode()) {
      console.log("[existsKey] params : ", JSON.stringify(params, null, 2));
    }

    try {
      const response = await DynamoDB.dial().getItem(params).promise();

      const res =
        typeof response.Item !== "undefined" && response.Item !== null;

      return res;
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);
      return false;
    }
  }

  public static async waitCreate(tableName: string): Promise<boolean> {
    try {
      const exists = await DynamoDB.existsTable(tableName);
      if (exists) return true;

      await DynamoDB.create(tableName);
      await DynamoDB.waitForCreate(tableName);

      return true;
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);
      return false;
    }
  }

  public static async waitRemove(tableName: string): Promise<boolean> {
    try {
      const exists = await DynamoDB.existsTable(tableName);
      if (!exists) return true;

      await DynamoDB.remove(tableName);
      await DynamoDB.waitForRemove(tableName);

      return true;
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);
      return false;
    }
  }

  public static async getData(
    tableName: string,
    key: string | string[]
  ): Promise<whatever | whatever[]> {
    const isMultiple = Array.isArray(key);

    try {
      const params = {
        TableName: tableName,
        ...DynamoDB.parseQueryParams((isMultiple ? key : [key]) as string[]),
      };

      if (DynamoDB.verboseMode()) {
        console.log("[getData] params : ", JSON.stringify(params, null, 2));
      }

      const response = await DynamoDB.dial().query(params).promise();
      const valid = !!response?.Items;

      if (valid) {
        const isMultiple = response.Count > 1;

        const items = response.Items.map((item) =>
          JSON.parse(item.JSON.S)
        ).sort((a, b) => a.createdAt - b.createdAt);

        const res = isMultiple ? items : items[0];

        return res;
      }

      return null;
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);
      return null;
    }
  }

  public static async putData(
    tableName: string,
    key: string,
    data: whatever | whatever[]
  ): Promise<void> {
    const isMultiple = Array.isArray(data);
    const basis = (isMultiple ? data : [data]) as whatever[];

    if (!DynamoDB.validKey(key)) throw `Key "${key}" is invalid`;

    const keyParts = key.split(":");
    const pk = keyParts[0];
    const id = keyParts.slice(1).join(":");

    const promises = basis.map(async (item) => {
      const valid = !!item;

      const itemOld = await DynamoDB.getData(tableName, key);

      const now = `${new Date().toISOString()}`;

      if (item?.createdAt) {
        item.createdAt = new Date(item.createdAt).toISOString() || null;
      }

      if (item?.updatedAt) {
        item.updatedAt = new Date(item.updatedAt).toISOString() || null;
      }

      const params = {
        Item: {
          PK: {
            S: pk,
          },
          ID: {
            S: id,
          },
          JSON: {
            S: JSON.stringify(valid ? item : {}),
          },
          CreatedAt: {
            S: item?.createdAt || itemOld?.createdAt || now,
          },
          UpdatedAt: {
            S: item?.updatedAt || now,
          },
        },
        TableName: tableName,
      };

      if (DynamoDB.verboseMode()) {
        console.log("[putData] params : ", JSON.stringify(params, null, 2));
      }

      const res = await DynamoDB.dial().putItem(params).promise();
      return res;
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);
    }
  }

  public static async removeData(
    tableName: string,
    key: string | string[]
  ): Promise<void> {
    const isMultiple = Array.isArray(key);
    const basis = (isMultiple ? key : [key]) as string[];

    const promises = basis.map((item) => {
      if (!DynamoDB.validKey(item)) throw `Key "${item}" is invalid`;

      const itemParts = item.split(":");
      const pk = itemParts[0];
      const id = itemParts.slice(1).join(":");

      const params = {
        Key: {
          PK: {
            S: pk,
          },
          ID: {
            S: id,
          },
        },
        TableName: tableName,
      };

      if (DynamoDB.verboseMode()) {
        console.log("[removeData] params : ", JSON.stringify(params, null, 2));
      }

      return DynamoDB.dial().deleteItem(params).promise();
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      if (DynamoDB.verboseMode()) console.log(err);
    }
  }

  public static verboseMode(): boolean {
    const modeRaw = process.env.STORAGE_VERBOSE_MODE;
    const mode = `${modeRaw}`.trim().toLowerCase();

    switch (mode) {
      case "true":
      case "t":
      case "yes":
      case "ja":
        return true;
      default:
        return false;
    }
  }

  public static validKey(key: string): boolean {
    const r = /(\S+:?\S+)+:?\*?/;
    return r.test(key);
  }

  public static parseParamExact(key: string, idx: number): whatever {
    const label = `:id${idx}`;
    return { label, expression: `#id = ${label}`, value: key };
  }

  public static parseParamWildcard(key: string, idx: number): whatever {
    const pos = key.indexOf("*");
    const valid = pos === key.length - 1;
    if (!valid) throw `Wildcards must be at the end of key "${key}"`;

    const label = `:id${idx}`;
    const value = key.replace(/:?\*?$/, "");

    return { label, expression: `begins_with(#id, ${label})`, value };
  }

  public static parseQueryParams(keys: string[]): whatever {
    const pks = [];

    const keyAttributeValues = {};
    const keyEvaluation = keys.reduce(
      (a, c, i) => {
        if (!DynamoDB.validKey(c)) throw `Key "${c}" is invalid`;
        const itemParts = c.indexOf(":") > -1 ? c.split(":") : [c];

        // handle primary key assembly
        const pk = itemParts[0];
        if (pks.indexOf(pk) < 0) {
          pks.push(pk);

          const pkFirst = pks.length === 0;
          const pkLabel = `:pk${pks.length - 1}`;

          a.pk = `${a.pk}${pkFirst ? " OR " : ""}#pk = ${pkLabel}`;
          keyAttributeValues[pkLabel] = { S: pk };
        }

        // handle ID assembly
        if (itemParts.length > 1) {
          const id = itemParts.slice(1).join(":");

          const info =
            id.indexOf("*") > -1
              ? DynamoDB.parseParamWildcard(id, i)
              : DynamoDB.parseParamExact(id, i);

          if (info.value && info.value.length > 0) {
            keyAttributeValues[info.label] = { S: info.value };

            const idFirst = i === 0;
            a.id = `${a.id}${idFirst ? "" : " AND "}${info.expression}`;
          }
        }

        return a;
      },
      { pk: "", id: "" }
    );

    if (pks.length > 1) keyEvaluation.pk = `(${keyEvaluation.pk})`;

    const validPK = keyEvaluation.pk && keyEvaluation.pk.length > 0;
    const validID = keyEvaluation.id && keyEvaluation.id.length > 0;

    const params = {
      KeyConditionExpression: [
        validPK ? keyEvaluation.pk : null,
        validID ? keyEvaluation.id : null,
      ]
        .filter((k) => k)
        .join(" AND "),
      ExpressionAttributeNames: {
        ...(validPK ? { "#pk": "PK" } : {}),
        ...(validID ? { "#id": "ID" } : {}),
      },
      ExpressionAttributeValues: keyAttributeValues,
    };

    return params;
  }

  private static async waitForCreate(tableName: string): Promise<boolean> {
    let ok = false;
    let interval = null;

    const check = async (): Promise<boolean> => {
      const res = await DynamoDB.existsTable(tableName);
      return res;
    };

    await new Promise((resolve) => {
      interval = setInterval(() => {
        check().then((res) => {
          if (res) {
            ok = true;
            clearInterval(interval);
            return resolve(ok);
          }
        });
      }, 250);
    });

    return ok;
  }

  private static async waitForRemove(tableName: string): Promise<boolean> {
    let ok = false;
    let interval = null;

    const check = async (): Promise<boolean> => {
      const res = await DynamoDB.existsTable(tableName);
      return res;
    };

    await new Promise((resolve) => {
      interval = setInterval(() => {
        check().then((res) => {
          if (!res) {
            ok = true;
            clearInterval(interval);
            return resolve(ok);
          }
        });
      }, 250);
    });

    return ok;
  }
}

export default DynamoDB;
