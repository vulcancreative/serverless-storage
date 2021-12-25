type whatever = any;

interface ServerlessStorage {
  tableName: string | undefined;
  kmsKey: string;
  defaultRegion: string;
}

interface ServerlessInstance {
  service: {
    service: string;
    provider: {
      stage: string;
      stackName: string;
      compiledCloudFormationTemplate: {
        Outputs: any;
      };
      apiGateway: {
        restApiId: string;
        websocketApiId: string;
      };
    };
    custom: {
      serverlessStorage?: ServerlessStorage | undefined;
    };
  };
  providers: {
    aws: {
      sdk: {
        APIGateway: any;
        ApiGatewayV2: any;
        Route53: any;
        CloudFormation: any;
        ACM: any;
        config: {
          // eslint-disable-next-line
          update(toUpdate: object): void;
        };
      };
      getCredentials();
      getRegion();
    };
  };
  cli: {
    log(str: string, entity?: string);
    consoleLog(str: any);
  };
}

interface ServerlessOptions {
  stage: string;
}

export { ServerlessInstance, ServerlessOptions, ServerlessStorage, whatever };
