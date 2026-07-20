import { afterEach, describe, expect, test, vi } from 'vitest';

import { getConfig } from './config';

describe('getConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('reads the table and optional local endpoint from the environment', () => {
    vi.stubEnv('AWS_REGION', 'eu-central-1');
    vi.stubEnv('ITEMS_TABLE_NAME', 'sandbox-test-items');
    vi.stubEnv('DYNAMODB_ENDPOINT', 'http://localhost:8000');

    expect(getConfig()).toEqual({
      region: 'eu-central-1',
      dynamoDb: {
        endpoint: 'http://localhost:8000',
        tableName: 'sandbox-test-items',
      },
    });
  });

  test('requires the table name provided by SST', () => {
    vi.stubEnv('ITEMS_TABLE_NAME', '');

    expect(() => getConfig()).toThrow(
      'Missing required environment variable ITEMS_TABLE_NAME',
    );
  });
});
