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
    expect(json).toHaveProperty('result', 'Success')
    expect(json).toHaveProperty(['context', 'items', 0, 'id'])
  })

  it('missing param', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({})
    })
    const json = await response.json()
    expect(json).toEqual({ result: 'Error', message: 'Missing attribute value.' })
  })

  it('param value is not string', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({ value: 10 })
    })
    const json = await response.json()
    expect(json).toEqual({ result: 'Error', message: 'Invalid string \'10 is type number\'.' })
  })
})
