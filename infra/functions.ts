/// <reference path="./../.sst/platform/config.d.ts" />

export const xrayPermissions = {
  actions: ['xray:PutTelemetryRecords', 'xray:PutTraceSegments'],
  resources: ['*'],
};

export const defaultFunctionProps: Partial<sst.aws.FunctionArgs> = {
  runtime: 'nodejs22.x',
  logging: {
    retention: '1 month',
  },
  permissions: [xrayPermissions],
  transform: {
    function: {
      tracingConfig: {
        mode: 'Active',
      },
    },
  },
  nodejs: {
    sourcemap: true,
  },
  environment: {
    NODE_OPTIONS: '--enable-source-maps',
    STAGE: $app.stage,
  },
};
