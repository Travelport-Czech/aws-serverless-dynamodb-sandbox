import { expect, test } from 'vitest';
import { Resource } from 'sst';

const url = Resource.Api.url;

test('POST /task should return created', async () => {
  const response = await fetch(`${url}/task`, {
    method: 'POST',
    headers: {
      Authorization: Resource.AccessToken.value,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description: 'new task' }),
  });
  const data = (await response.json()) as Record<string, unknown>;

  expect(response.status).toBe(201);
  expect(data).toHaveProperty('result', 'success');
  expect(data).toHaveProperty('data.attributes.description', 'new task');
});

test('POST /task rejects an invalid access token', async () => {
  const response = await fetch(`${url}/task`, {
    method: 'POST',
    headers: {
      Authorization: `${Resource.AccessToken.value}-suffix`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description: 'new task' }),
  });

  expect(response.status).toBe(403);
});

test.each([
  ['a missing description', {}],
  ['a non-string description', { description: 10 }],
])('POST /task rejects %s', async (_scenario, body) => {
  const response = await fetch(`${url}/task`, {
    method: 'POST',
    headers: {
      Authorization: Resource.AccessToken.value,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  expect(response.status).toBe(422);
});
