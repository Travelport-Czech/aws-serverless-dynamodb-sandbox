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
  const ddbClientWithoutXray = new DynamoDBClient({
    ...(config.dynamoDb.endpoint
      ? {
          credentials: {
            accessKeyId: 'local',
            secretAccessKey: 'local',
          },
          endpoint: config.dynamoDb.endpoint,
        }
      : {}),
    region: config.region,
  });

  const ddbClient =
    process.env.DISABLE_XRAY === 'true' || config.dynamoDb.endpoint
      ? ddbClientWithoutXray
      : AWSXRay.captureAWSv3Client(ddbClientWithoutXray);

  return DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
  });
};
