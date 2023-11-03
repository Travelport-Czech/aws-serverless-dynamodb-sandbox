import { APIGatewayProxyResult } from 'aws-lambda';

export const createApiResponse = (
  statusCode: number,
  output: unknown,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(output),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
