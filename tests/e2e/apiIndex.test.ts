import fetch from 'node-fetch'

const url = 'http://localhost:3000'

describe('API Index', () => {
  it('ok', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({ value: 'val' })
    })
    const json = await response.json()
    console.log('michal', json)
    expect(json).toHaveProperty('result', 'Success')
    expect(json).toHaveProperty(['context', 'items', 0, 'id'])
  })
})
