import * as request from 'supertest'
import { getAllItemsByUser } from '../../src/database/itemRepository'

const url = 'http://localhost:3000'

describe('API Index', () => {
  it('should return one created item', async () => {
    expect(await getAllItemsByUser('newUser')).toHaveLength(0)

    const data = { value: 'val' }
    const response = await request(url)
      .post('/')
      .set({ Authorization: 'token'})
      .send(data)
      .expect(200)

    expect(response.body).toHaveProperty('result', 'Success')
    expect(response.body).toHaveProperty(['context', 'items', 0, 'id'])

    expect(await getAllItemsByUser('newUser')).toHaveLength(1)
  })

  it('should fail on bad token', async () => {
    const data = { value: 'val' }
    const response = await request(url)
      .post('/')
      .set({ Authorization: 'bad-token'})
      .send(data)
      .expect(401)

    expect(response.body).toEqual({ error: 'Unauthorized', message: 'Unauthorized', statusCode: 401 })
  })

  it('should fail with missing param', async () => {
    const data = {}
    const response = await request(url)
      .post('/')
      .set({ Authorization: 'token'})
      .send(data)
      .expect(422)
    expect(response.body).toEqual({ result: 'Error', message: 'Missing attribute value.' })
  })

  it('should fail with param value as number', async () => {
    const data = { value: 10 }
    const response = await request(url)
      .post('/')
      .set({ Authorization: 'token'})
      .send(data)
      .expect(422)
    expect(response.body).toEqual({ result: 'Error', message: 'Invalid string \'10 is type number\'.' })
  })
})
