import * as dotenv from 'dotenv'

dotenv.config({ path: 'tests/e2e/.env' })

jest.setTimeout(10000) // in milliseconds
