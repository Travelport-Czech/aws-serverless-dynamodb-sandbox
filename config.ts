import * as process from 'process';

interface Config {
  region: 'eu-central-1' | 'us-east-1';
  dynamoDb: {
    tableName: string;
    port: number;
  };
  s3: {
    deploymentBucket: string;
    port: number;
  };
  isOffline?: boolean;
}

const defaultConfig: Config = {
  region: 'eu-central-1',
  dynamoDb: {
    tableName: 'items',
    port: 3001,
  },
  s3: {
    deploymentBucket: 'aws-serverless-sandbox-1237841654', // use custom hash to avoid conflicts
    port: 8000,
  },
};

const configProduction: Config = {
  ...defaultConfig,
  isOffline: false,
};

const configLocal: Config = {
  ...defaultConfig,
  isOffline: true,
};

export const getConfig = (
  stage = process.env.STAGE,
): Config & { stage: 'offline' | 'production' } => {
  if (stage === 'offline') {
    return {
      ...configLocal,
      stage: 'offline',
    };
  }

  if (stage === 'production') {
    return {
      ...configProduction,
      stage: 'production',
    };
  }

  throw new Error(`No available config for stage ${stage}`);
};
