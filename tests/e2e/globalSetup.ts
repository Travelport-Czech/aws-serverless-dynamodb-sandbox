import * as process from 'process';

export default async function (): Promise<void> {
  process.env.STAGE = 'production';
  process.env.DISABLE_XRAY = 'true';
}
