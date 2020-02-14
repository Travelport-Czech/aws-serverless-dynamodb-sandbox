import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
process.env['IS_OFFLINE'] = 'true'

jest.setTimeout(10000) // in milliseconds
