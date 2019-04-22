module.exports = {
  name: 'stock-history-stock-history',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/stock-history/stock-history/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
