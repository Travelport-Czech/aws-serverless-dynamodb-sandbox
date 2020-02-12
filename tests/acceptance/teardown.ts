import { SpawnOptions, spawnSync } from 'child_process'

export default async function teardown(options: SpawnOptions = {}): Promise<void> {
  const child = await spawnSync(
    'npm',
    [
      'run',
      'serverless',
      '--',
      'remove',
      '--stage',
      'test-acceptance'
    ],
    { detached: true, ...options },
  )

  console.log(child.stderr.toString())
  console.log('AWS Test remove done.')
}
