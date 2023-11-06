import { expect, test } from 'vitest';
import axios from 'axios';
import * as fs from 'fs';

const url = (
  JSON.parse(fs.readFileSync('outputs.json', 'utf8')) as {
    ServiceEndpoint: string;
  }
).ServiceEndpoint;

test('/error should return success response', async () => {
  const response = await axios({
    method: 'get',
    url: `${url}/error`,
    validateStatus: () => true,
  });

  expect(response.status).toEqual(500);
  expect(response.data).toEqual('Internal error');
});
