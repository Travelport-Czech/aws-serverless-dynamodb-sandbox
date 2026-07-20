import { expect, test } from 'vitest';
import { Resource } from 'sst';

const url = Resource.Api.url;

test('/error should return success response', async () => {
  const response = await fetch(`${url}/error`);

  expect(response.status).toBe(500);
  await expect(response.text()).resolves.toBe('Internal error');
});
