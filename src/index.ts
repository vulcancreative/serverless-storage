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
            usage: "Initialises storage with default/provided table name",
            lifecycleEvents: ["create", "initialize"],
          },
          purge: {
            usage: "Purges some data from a table",
            lifecycleEvents: ["delete", "initialize"],
            options: {
              all: {
                usage: "Removes all data from the storage table",
              },
              key: {
                usage: "Removes data from table for a given key",
              },
            },
          },
          remove: {
            usage: "Removes the table and all of its associated data",
            lifecycleEvents: ["delete", "initialize"],
          },
        },
      },
    };

    this.hooks = {
      "after:info:info": () => this.afterInfoHook(),
      "before:deploy:deploy": () => this.beforeDeployHook(),
      "storage:create:create": () => this.storageCreateHook(),
      "storage:purge:delete": () => this.storagePurgeHook(),
      "storage:remove:delete": () => this.storageRemoveHook(),
    };
  }

  public afterInfoHook(): Promise<void> {
    return infoHook(this.serverless).then((message) => Log.print(message));
  }

  public beforeDeployHook(): Promise<void> {
    return createHook(this.serverless).then((message) => Log.print(message));
  }

  // eslint-disable-next-line
  public async storageCreateHook(): Promise<void> {
    return createHook(this.serverless).then((message) => Log.print(message));
  }

  public storagePurgeHook(): void {
    purgeHook(this.serverless);
  }

  public async storageRemoveHook(): Promise<void> {
    return removeHook(this.serverless).then((message) => Log.print(message));
  }
}

export = ServerlessStorage;
