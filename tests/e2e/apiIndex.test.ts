import * as request from 'supertest'
import { getAllItemsByUser } from '../../src/database/itemRepository'

const url = 'http://localhost:3000'

describe('API Index', () => {
  it('ok', async () => {
    expect(await getAllItemsByUser('newUser')).toHaveLength(0)

    const data = { value: 'val' }
    const response = await request(url)
      .post('/')
      .send(data)
      .expect(200)

    expect(response.body).toHaveProperty('result', 'Success')
    expect(response.body).toHaveProperty(['context', 'items', 0, 'id'])

    expect(await getAllItemsByUser('newUser')).toHaveLength(1)
  })

  it('missing param', async () => {
    const data = {}
    const response = await request(url)
      .post('/')
      .send(data)
      .expect(422)
    expect(response.body).toEqual({ error: 'Missing attribute value.' })
  })

  it('param value is not string', async () => {
    const data = { value: 10 }
    const response = await request(url)
      .post('/')
      .send(data)
      .expect(422)
    expect(response.body).toEqual({ error: 'Invalid string \'10 is type number\'.' })
  })
})
