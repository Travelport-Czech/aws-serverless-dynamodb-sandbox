import type {
  CustomAuthorizerEvent,
  CustomAuthorizerHandler,
  CustomAuthorizerResult,
} from 'aws-lambda';
import { Resource } from 'sst';
import { passwordsAreSame } from '@app/utils/passwordsAreSame';
import {
  generateAllowPolicy,
  generateDenyPolicy,
} from '@app/utils/policyFactory';
import middy from '@middy/core';

export interface Credential {
  readonly principalId: string;
  readonly accessToken: string;
  readonly allowedMethods: string[];
}

export const authorizeRequest = async (
  event: CustomAuthorizerEvent,
  credentials: Credential[],
): Promise<CustomAuthorizerResult> => {
  const actualToken =
    event.headers?.Authorization ?? event.headers?.authorization;

  if (!actualToken) {
    return generateDenyPolicy('unauthorized', event.methodArn);
  }

  const result = credentials.filter((item) => {
    return passwordsAreSame(item.accessToken.trim(), actualToken);
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

const handler: CustomAuthorizerHandler = async (event) => {
  return authorizeRequest(event, [
    {
      principalId: 'test-access',
      accessToken: Resource.AccessToken.value,
      allowedMethods: ['POST/task'],
    },
  ]);
};

export const authorizer = middy(handler);
