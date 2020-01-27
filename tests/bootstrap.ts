import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.jest' })

jest.setTimeout(10000) // in milliseconds
