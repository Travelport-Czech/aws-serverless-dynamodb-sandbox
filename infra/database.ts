/// <reference path="./../.sst/platform/config.d.ts" />

export const itemsTable = new sst.aws.Dynamo('ItemsTable', {
  fields: {
    principalId: 'string',
    id: 'string',
  },
  primaryIndex: {
    hashKey: 'principalId',
    rangeKey: 'id',
  },
});
