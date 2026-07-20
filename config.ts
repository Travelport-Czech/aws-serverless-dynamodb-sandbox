interface Config {
  region: string;
  dynamoDb: {
    tableName: string;
    endpoint?: string;
  };
}

const requireEnvironmentVariable = (
  name: string,
  environment: NodeJS.ProcessEnv,
): string => {
  const value = environment[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
};

export const getConfig = (
  environment: NodeJS.ProcessEnv = process.env,
): Config => {
  const endpoint = environment.DYNAMODB_ENDPOINT?.trim();

  return {
    region: environment.AWS_REGION ?? 'eu-central-1',
    dynamoDb: {
      tableName: requireEnvironmentVariable('ITEMS_TABLE_NAME', environment),
      ...(endpoint ? { endpoint } : {}),
    },
  };
};
