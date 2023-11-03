import {
  CustomAuthorizerEvent,
  CustomAuthorizerHandler,
  CustomAuthorizerResult,
} from 'aws-lambda';
import { passwordsAreSame } from '@/utils/passwordsAreSame';
import { generateAllowPolicy, generateDenyPolicy } from '@/utils/policyFactory';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

interface Credential {
  readonly name: string;
  readonly description: string;
  readonly accessToken: string;
  readonly allowedMethods: string[];
}

const credentialsList: Credential[] = [
  {
    name: 'Test Access',
    description: 'Access for testing',
    accessToken: 'token',
    allowedMethods: ['POST/'],
  },
];

const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
): Promise<CustomAuthorizerResult> => {
  const actualToken = event.headers?.Authorization ?? undefined;

  if (!actualToken) {
    return generateDenyPolicy('', event.methodArn);
  }

  const result = credentialsList.filter((item) => {
    return passwordsAreSame(item.accessToken, actualToken);
  });

  if (result.length !== 1) {
    return generateDenyPolicy('', event.methodArn);
  }

  return generateAllowPolicy(
    event.methodArn,
    result[0].name,
    result[0].allowedMethods,
  );
};

export const authorizer = middy(handler).use(inputOutputLogger());
