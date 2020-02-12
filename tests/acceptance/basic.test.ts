import * as request from 'supertest'

const url = process.env.API_URL

describe('Acceptance basic', () => {
  it('should API /status work', async () => {
    const response = await request(url)
      .get('/status')
      .expect(200)

    expect(response.body).toEqual({ result: 'Success' })
  })

  it('should API / work', async () => {
    const data = { value: 'val' }
    const response = await request(url)
      .post('/')
      .set({ Authorization: 'token' })
      .send(data)
      .expect(200)

    expect(response.body).toHaveProperty('result', 'Success')
    expect(response.body).toHaveProperty(['context', 'items', 0, 'id'])
  })
})
