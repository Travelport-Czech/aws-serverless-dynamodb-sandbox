const productionStages = new Set(['prod', 'production']);

export const getAppConfig = (stage?: string) => {
  const isProduction = stage ? productionStages.has(stage) : false;

  return {
    name: 'dynamodb-sandbox',
    version: '4.17.1',
    removal: isProduction ? ('retain' as const) : ('remove' as const),
    protect: isProduction,
    home: 'aws' as const,
    providers: {
      aws: {
        region: 'eu-central-1' as const,
      },
    },
  };
};
