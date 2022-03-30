import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as stream from "stream";
import * as zlib from "zlib";

import { whatever } from "../types";

const loc = process.env.AWS_REGION || process.env.STORAGE_DEFAULT_REGION;

class S3 {
  private static dial(region: string = loc): whatever {
    return new AWS.S3({
      apiVersion: "2006-03-01",
      region,
    });
  }

  public static async info(name: string): Promise<string> {
    const exists = await S3.existsBucket(name);
    if (exists) return `File storage is ready in table "${name}"`;

    return "File storage doesn't exist";
  }

  public static async create(name: string): Promise<string> {
    const config = {
      Bucket: name,
    };

    const exists = await S3.existsBucket(name);
    if (exists) return "File storage already exists";

    try {
      await S3.dial().createBucket(config).promise();
      const message = `Successfully created storage bucket "${name}"`;
      return message;
    } catch (err) {
      if (err.message.indexOf("exists") > -1) {
        return "File storage already exists";
      }

      return `Failed to create storage : ${err.message}`;
    }
  }

  public static async remove(name: string): Promise<string> {
    const config = {
      Bucket: name,
    };

    try {
      await S3.purge(name);
      await S3.dial().deleteBucket(config).promise();

      const message = `Successfully removed file storage "${name}"`;
      return message;
    } catch (err) {
      if (err.message.indexOf("does not exist") > -1) {
        return "File storage doesn't exist";
      }

      return `Failed to remove file storage : ${err.message}`;
    }
  }

  public static async upload(key: string, data: whatever): Promise<string> {
    const base = key.endsWith(".gz") ? key : `${key}.gz`;

    const config = {
      Key: base,
      Body: data.pipe(zlib.createGzip()),
      Bucket: process.env.STORAGE_BUCKET_NAME,
      ContentType: "application/x-gzip",
      StorageClass: "STANDARD",
    };

    const result = await S3.dial().upload(config).promise();
    return result.Key;
  }

  public static async uploadFile(key: string, file: string): Promise<string> {
    const base = key.endsWith(".gz") ? key : `${key}.gz`;
    const data = fs.createReadStream(file).pipe(zlib.createGzip());

    const config = {
      Key: base,
      Body: data,
      Bucket: process.env.STORAGE_BUCKET_NAME,
      ContentType: "application/x-gzip",
      StorageClass: "STANDARD",
    };

    const result = await S3.dial().upload(config).promise();
    return result.Key;
  }

  // public static async download(path: string): Promise<whatever> {}

  public static downloadStream(key: string): stream.Stream {
    const base = key.endsWith(".gz") ? key : `${key}.gz`;

    const config = {
      Key: base,
      Bucket: process.env.STORAGE_BUCKET_NAME,
    };

    const res = S3.dial()
      .getObject(config)
      .createReadStream()
      .on("error", (err) => {
        if (S3.verboseMode()) console.log(err);
      });

    return res.pipe(zlib.createGunzip());
  }

  public static async downloadSelect(
    key: string,
    opt: whatever
  ): Promise<Buffer> {
    const base = key.endsWith(".gz") ? key : `${key}.gz`;
    const inputCSV = key.indexOf("csv") > -1;
    const outputCSV = opt?.as?.toLowerCase?.() === "csv";

    const config = {
      Key: base,
      Bucket: process.env.STORAGE_BUCKET_NAME,
      ExpressionType: "SQL",
      Expression: opt.query,
      InputSerialization: {
        CompressionType: "GZIP",
        ...(inputCSV
          ? {
              CSV: {
                FileHeaderInfo: "USE",
                RecordDelimiter: "\n",
                FieldDelimiter: ",",
              },
            }
          : {
              JSON: {
                Type: "LINES",
              },
            }),
      },
      OutputSerialization: {
        ...(outputCSV
          ? {
              CSV: {},
            }
          : {
              JSON: {},
            }),
      },
    };

    return new Promise((resolve, reject) => {
      const verbose = S3.verboseMode();
      const buffer = [];

      S3.dial().selectObjectContent(config, (err, data) => {
        if (err) {
          if (verbose) console.log("[downloadSelect] err : ", err);
          reject(err);
        }

        const strm = data.Payload;

        strm.on("data", (event) => {
          if (event.Records && event.Records.Payload) {
            buffer.push(event.Records.Payload);
          } else if (verbose && event.Stats) {
            console.log("[downloadSelect] event.Stats : ", event.Stats);
          } else if (verbose && event.Progress) {
            console.log("[downloadSelect] event.Progress : ", event.Progress);
          } else if (verbose && event.Cont) {
            console.log("[downloadSelect] event.Cont : ", event.Cont);
          } else if (verbose && event.End) {
            console.log("[downloadSelect] event.End : ", event.End);
          }
        });

        strm.on("error", (err) => {
          if (verbose) console.log("[downloadSelect] err : ", err);
          reject(err);
        });

        strm.on("end", () => {
          if (verbose) console.log("[downloadSelect] done");
          resolve(Buffer.concat(buffer));
        });
      });
    });
  }

  public static async existsBucket(name: string): Promise<boolean> {
    const config = {
      Bucket: name,
    };

    const res = await new Promise((resolve) => {
      S3.dial().headBucket(config, (err) => {
        const exists = !err;
        if (exists) return resolve(true);
        return resolve(false);
      });
    });

    return !!res;
  }

  public static async purge(name: string): Promise<string> {
    const config = {
      Bucket: name,
    };

    try {
      let objs = await S3.dial().listObjects(config).promise();

      while (objs.length > 0) {
        await Promise.all(
          objs.Contents.map((obj) => {
            const key = obj.Key;
            return S3.dial().deleteObject({ ...config, Key: key });
          })
        );

        objs = await S3.dial().listObjects(config).promise();
      }
    } catch (err) {
      if (S3.verboseMode()) console.log(err);
      return `Failed to remove file storage : ${err.message}`;
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

  public static async waitCreate(name: string): Promise<boolean> {
    try {
      const exists = await S3.existsBucket(name);
      if (exists) return true;

      await S3.create(name);
      await S3.waitForCreate(name);

      return true;
    } catch (err) {
      if (S3.verboseMode()) console.log(err);
      return false;
    }
  }

  public static async waitRemove(name: string): Promise<boolean> {
    try {
      const exists = await S3.existsBucket(name);
      if (!exists) return true;

      await S3.remove(name);
      await S3.waitForRemove(name);

      return true;
    } catch (err) {
      if (S3.verboseMode()) console.log(err);
      return false;
    }
  }

  private static async waitForCreate(name: string): Promise<boolean> {
    let ok = false;
    let interval = null;

    const check = async (): Promise<boolean> => {
      const res = await S3.existsBucket(name);
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

  private static async waitForRemove(name: string): Promise<boolean> {
    let ok = false;
    let interval = null;

    const check = async (): Promise<boolean> => {
      const res = await S3.existsBucket(name);
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

export default S3;
