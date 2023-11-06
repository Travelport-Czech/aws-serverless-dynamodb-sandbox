import { expect, test } from 'vitest';
import axios from 'axios';
import * as fs from 'fs';

const url = (
  JSON.parse(fs.readFileSync('outputs.json', 'utf8')) as {
    ServiceEndpoint: string;
  }
).ServiceEndpoint;

test('POST /task should return created', async () => {
  const data = { description: 'new task' };
  const response = await axios({
    method: 'post',
    url: `${url}/task`,
    headers: { Authorization: `token` },
    data: data,
    validateStatus: () => true,
  });

  expect(response.status).toEqual(201);
  expect(response.data).toHaveProperty('result', 'success');
  expect(response.data).toHaveProperty(
    'data.attributes.description',
    'new task',
  );
});
