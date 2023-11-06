import {
  CustomAuthorizerEvent,
  CustomAuthorizerHandler,
  CustomAuthorizerResult,
} from 'aws-lambda';
import { passwordsAreSame } from '@app/utils/passwordsAreSame';
import {
  generateAllowPolicy,
  generateDenyPolicy,
} from '@app/utils/policyFactory';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

interface Credential {
  readonly principalId: string;
  readonly accessToken: string;
  readonly allowedMethods: string[];
}

const credentialsList: Credential[] = [
  {
    principalId: 'test-access',
    accessToken: 'token',
    allowedMethods: ['POST/task'],
  },
];

const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
): Promise<CustomAuthorizerResult> => {
  const actualToken = event.headers?.Authorization ?? undefined;

  if (!actualToken) {
    return generateDenyPolicy('unauthorized', event.methodArn);
  }

  const result = credentialsList.filter((item) => {
    return passwordsAreSame(item.accessToken, actualToken);
  });

  if (result.length !== 1) {
    return generateDenyPolicy('unauthorized', event.methodArn);
  }

  return generateAllowPolicy(
    event.methodArn,
    result[0].principalId,
    result[0].allowedMethods,
  );
};

export const authorizer = middy(handler).use(inputOutputLogger());
