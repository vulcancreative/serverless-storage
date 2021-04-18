import { ServerlessInstance } from "../types";

class Log {
  public static pluginName: string;
  public static serverless: ServerlessInstance;

  public static print(message: string): void {
    Log.serverless.cli.log(message, Log.pluginName);
  }
}

export default Log;
