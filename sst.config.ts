/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app: async (input) => {
    const { getAppConfig } = await import('./infra/app');

    return getAppConfig(input?.stage);
  },
  run: async () => {
    const { api } = await import('./infra/api');
    const { itemsTable } = await import('./infra/database');

    return {
      ApiEndpoint: api.url,
      ItemsTableName: itemsTable.name,
    };
  },
});
