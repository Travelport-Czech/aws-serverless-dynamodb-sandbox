import { expect, test } from 'vitest';
import * as taskRepository from '@app/database/taskRepository';
import axios from 'axios';

const url = 'http://localhost:3000/task';

const principalId = 'test-access';

test.only('should return one created item', async () => {
  expect(await taskRepository.getAllTasks(principalId)).toHaveLength(0);

  const data = { description: 'new task' };
  const response = await axios({
    method: 'post',
    url,
    headers: { Authorization: `token` },
    data: data,
    validateStatus: () => true,
  });

  expect(response.status).toEqual(201);
  expect(response.data).toHaveProperty('result', 'success');
  expect(response.data).toHaveProperty('message', 'Task created successfully');
  expect(response.data).toHaveProperty('data.type', 'Task');
  expect(response.data).toHaveProperty(
    'data.attributes.description',
    'new task',
  );
  expect(response.data).toHaveProperty('data.id');
  expect(response.data).toHaveProperty('data.created');

  expect(await taskRepository.getAllTasks(principalId)).toHaveLength(1);
});

test('should fail on bad token', async () => {
  const data = { description: 'val' };
  const response = await axios({
    method: 'post',
    url,
    headers: { Authorization: `bad-token` },
    data: data,
    validateStatus: () => true,
  });

  expect(response.data).toEqual({
    error: 'Forbidden',
    message: 'User is not authorized to access this resource',
    statusCode: 403,
  });
});

test('should fail with missing description', async () => {
  const data = {};
  const response = await axios({
    method: 'post',
    url,
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
      path: ['description'],
      received: 'undefined',
    },
  ]);
});

test('should fail with description as number', async () => {
  const data = { description: 10 };
  const response = await axios({
    method: 'post',
    url,
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
      path: ['description'],
      received: 'number',
    },
  ]);
});
