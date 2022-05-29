import createHook from "./hooks/create";
import infoHook from "./hooks/info";
import purgeHook from "./hooks/purge";
import removeHook from "./hooks/remove";
import Operations from "./operations";
import { ServerlessInstance, ServerlessOptions } from "./types";
import Log from "./util/log";

class ServerlessStorage {
  public static serverlessStorage = Operations;

  public pluginName: string;
  public serverless: ServerlessInstance;
  public options: ServerlessOptions;
  public commands: object; // eslint-disable-line
  public hooks: object; // eslint-disable-line

  constructor(serverless: ServerlessInstance, options: ServerlessOptions) {
    this.serverless = serverless;
    this.options = options;

    Log.pluginName = "Serverless Storage";
    Log.serverless = serverless;

    this.commands = {
      storage: {
        commands: {
          create: {
            usage: "Initialises database and/or file storage",
            lifecycleEvents: ["create", "initialize"],
            options: {
              tableName: {
                usage: "Optionally allows for explicit table name",
                type: "string",
              },
              bucketName: {
                usage: "Optionally allows for explicit bucket name",
                type: "string",
              },
            },
          },
          purge: {
            usage: "Purges a database table or file storage bucket",
            lifecycleEvents: ["delete", "initialize"],
            options: {
              all: {
                usage: "Removes all data from storage",
                type: "boolean",
              },
              key: {
                usage: "Removes data for a given key",
                type: "string",
              },
            },
          },
          remove: {
            usage: "Removes the table and/or bucket and all associated data",
            lifecycleEvents: ["delete", "initialize"],
            options: {
              tableName: {
                usage: "Optionally allows for explicit table name",
                type: "string",
              },
              bucketName: {
                usage: "Optionally allows for explicit bucket name",
                type: "string",
              },
            },
          },
        },
      },
    };

    this.hooks = {
      "after:info:info": () => this.afterInfoHook(),
      "before:deploy:deploy": () => this.beforeDeployHook(),
      "after:remove:remove": () => this.storageRemoveHook(),
      "storage:create:create": () => this.storageCreateHook(),
      "storage:purge:delete": () => this.storagePurgeHook(),
      "storage:remove:delete": () => this.storageRemoveHook(),
    };
  }

  public afterInfoHook(): Promise<void> {
    return infoHook(this.serverless).then((messages) => {
      messages.forEach((message) => {
        if (message) Log.print(message);
      });
    });
  }

  public beforeDeployHook(): Promise<void> {
    return createHook(this.serverless, this.options).then((messages) => {
      messages.forEach((message) => {
        if (message) Log.print(message);
      });
    });
  }

  // eslint-disable-next-line
  public async storageCreateHook(): Promise<void> {
    return createHook(this.serverless, this.options).then((messages) => {
      messages.forEach((message) => {
        if (message) Log.print(message);
      });
    });
  }

  public storagePurgeHook(): void {
    purgeHook(this.serverless);
  }

  public async storageRemoveHook(): Promise<void> {
    return removeHook(this.serverless, this.options).then((messages) => {
      messages.forEach((message) => {
        if (message) Log.print(message);
      });
    });
  }
}

export = ServerlessStorage;
