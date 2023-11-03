import { describe, expect, test } from 'vitest';
import axios from 'axios';
import * as fs from 'fs';

const url = (
  JSON.parse(fs.readFileSync('outputs.json', 'utf8')) as {
    ServiceEndpoint: string;
  }
).ServiceEndpoint;

describe('Acceptance basic', () => {
  test('should API /status work', async () => {
    const response = await axios({
      method: 'get',
      url: `${url}/status`,
      validateStatus: () => true,
    });

    expect(response.status).toEqual(200);
    expect(response.data).toEqual({ message: 'Hello, API is ready.' });
  });

  test('should API / work', async () => {
    const data = { value: 'val' };
    const response = await axios({
      method: 'post',
      url: `${url}/`,
      headers: { Authorization: `token` },
      data: data,
      validateStatus: () => true,
    });

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty(['context', 'items', 0, 'id']);
  });
});
