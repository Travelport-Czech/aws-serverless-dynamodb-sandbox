import { describe, expect, test } from 'vitest';
import { getAllItemsByUser } from '../database/itemRepository';
import axios from 'axios';

const url = 'http://localhost:3000';

describe('API Index', () => {
  test('should return one created item', async () => {
    expect(await getAllItemsByUser('newUser')).toHaveLength(0);

    const data = { value: 'val' };
    const response = await axios({
      method: 'post',
      url: `${url}/`,
      headers: { Authorization: `token` },
      data: data,
    });

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty(['context', 'items', 0, 'id']);

    expect(await getAllItemsByUser('newUser')).toHaveLength(1);
  });

  test('should fail on bad token', async () => {
    const data = { value: 'val' };
    const response = await axios({
      method: 'post',
      url: `${url}/`,
      headers: { Authorization: `bad-token` },
      data: data,
      validateStatus: () => true,
    });

    expect(response.data).toEqual({
      error: 'Unauthorized',
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  test('should fail with missing param', async () => {
    const data = {};
    const response = await axios({
      method: 'post',
      url: `${url}/`,
      headers: { Authorization: `token` },
      data: data,
      validateStatus: () => true,
    });

    expect(response.status).toEqual(422);
    expect(response.data).toEqual([
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Required',
        path: ['value'],
        received: 'undefined',
      },
    ]);
  });

  test('should fail with param value as number', async () => {
    const data = { value: 10 };
    const response = await axios({
      method: 'post',
      url: `${url}/`,
      headers: { Authorization: `token` },
      data: data,
      validateStatus: () => true,
    });

    expect(response.status).toEqual(422);
    expect(response.data).toEqual([
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['value'],
        received: 'number',
      },
    ]);
  });
});
