import AWSXRay from 'aws-xray-sdk';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getConfig } from '@config';

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

export const createDynamoDbDocumentClient = () => {
  const config = getConfig();

  if (config.isOffline) {
    const ddbClient = new DynamoDBClient({
      endpoint: 'http://localhost:3001',
      region: 'eu-central-1',
    });
    return DynamoDBDocumentClient.from(ddbClient, {
      marshallOptions,
      unmarshallOptions,
    });
  }

  const ddbClientWithoutXray = new DynamoDBClient({
    region: config.region,
  });

  // set DISABLE_XRAY to true, if it is run in vitest
  return DynamoDBDocumentClient.from(
    process.env.DISABLE_XRAY === 'true'
      ? ddbClientWithoutXray
      : AWSXRay.captureAWSv3Client(ddbClientWithoutXray),
    {
      marshallOptions,
      unmarshallOptions,
    },
  );
};
