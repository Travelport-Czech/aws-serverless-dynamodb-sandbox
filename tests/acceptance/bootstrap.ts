import * as dotenv from 'dotenv'
import { spawnSync, SpawnOptions } from 'child_process'

const regex = /(https:\/\/.*amazonaws\.com)/gm;

export default async function setup(options: SpawnOptions = {}): Promise<void> {
  dotenv.config({ path: 'tests/acceptance/.env' })

  const child = await spawnSync(
    'npm',
    [
      'run',
      'serverless',
      '--',
      'deploy',
      '--stage',
      'test-acceptance'
    ],
    { detached: true, ...options },
  )

  const output = child.stdout.toString()

  const apiUrlArray = output.match(regex)
  const apiUrl = apiUrlArray && apiUrlArray[0]

  if (!apiUrl) {
    throw new Error('Can not parse api url.')
  }

  process.env['API_URL'] = `${apiUrl}/test-acceptance`

  console.log(child.stderr.toString())
  console.log('AWS Test deploy done.')
}
