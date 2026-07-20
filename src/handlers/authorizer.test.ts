import type { CustomAuthorizerEvent } from 'aws-lambda';
import { describe, expect, test } from 'vitest';

import { authorizeRequest } from './authorizer';

const event = {
  type: 'REQUEST',
  headers: {
    Authorization: 'secret-token',
  },
  methodArn:
    'arn:aws:execute-api:eu-central-1:123456789012:api-id/test/POST/task',
} as CustomAuthorizerEvent;

describe('authorizeRequest', () => {
  test('allows an exact token match', async () => {
    const result = await authorizeRequest(event, [
      {
        accessToken: 'secret-token',
        allowedMethods: ['POST/task'],
        principalId: 'test-access',
      },
    ]);

    expect(result.principalId).toBe('test-access');
    expect(result.policyDocument.Statement[0].Effect).toBe('Allow');
  });

  test('normalizes whitespace accidentally stored with the secret', async () => {
    const result = await authorizeRequest(event, [
      {
        accessToken: 'secret-token\n',
        allowedMethods: ['POST/task'],
        principalId: 'test-access',
      },
    ]);

    expect(result.policyDocument.Statement[0].Effect).toBe('Allow');
  });

  test('denies a token with an attacker-controlled suffix', async () => {
    const result = await authorizeRequest(
      {
        ...event,
        headers: {
          Authorization: 'secret-token-suffix',
        },
      },
      [
        {
          accessToken: 'secret-token',
          allowedMethods: ['POST/task'],
          principalId: 'test-access',
        },
      ],
    );

    expect(result.policyDocument.Statement[0].Effect).toBe('Deny');
  });
});
