import { DynamoDB } from 'aws-sdk';
import { getConfig } from '../../config';

export const getDocumentClient = (): DynamoDB.DocumentClient => {
  const config = getConfig();
  if (config.isOffline) {
    return new DynamoDB.DocumentClient({
      endpoint: 'http://localhost:3001',
      region: config.region,
    });
  }

  return new DynamoDB.DocumentClient();
};
