import { expect, test } from 'vitest';
import axios from 'axios';
import * as fs from 'fs';

const url = (
  JSON.parse(fs.readFileSync('outputs.json', 'utf8')) as {
    ServiceEndpoint: string;
  }
).ServiceEndpoint;

test('/status should return success response', async () => {
  const response = await axios({
    method: 'get',
    url: `${url}/status`,
    validateStatus: () => true,
  });

  expect(response.status).toEqual(200);
  expect(response.data).toEqual({ message: 'Hello, API is ready.' });
});
