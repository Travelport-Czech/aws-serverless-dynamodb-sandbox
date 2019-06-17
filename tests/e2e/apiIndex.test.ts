import { expect } from 'chai'
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
    expect(json).to.have.property('result', 'Success')
    expect(json).to.have.property('message', 'Done.')
    expect(json).to.have.nested.property('context.items[0].id')
  })
})
