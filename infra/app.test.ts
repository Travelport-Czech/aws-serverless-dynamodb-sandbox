import { describe, expect, test } from 'vitest';

import { getAppConfig } from './app';

describe('getAppConfig', () => {
  test('protects and retains production resources', () => {
    expect(getAppConfig('production')).toMatchObject({
      name: 'dynamodb-sandbox',
      protect: true,
      removal: 'retain',
    });
  });

  test('removes disposable development stages', () => {
    expect(getAppConfig('developer-stage')).toMatchObject({
      name: 'dynamodb-sandbox',
      protect: false,
      removal: 'remove',
    });
  });
});
