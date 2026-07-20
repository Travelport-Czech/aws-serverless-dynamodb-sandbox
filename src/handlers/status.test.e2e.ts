import { expect, test } from 'vitest';
import { Resource } from 'sst';

const url = Resource.Api.url;

test('/status should return success response', async () => {
  const response = await fetch(`${url}/status`);

  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual({
    message: 'Hello, API is ready.',
  });
});
