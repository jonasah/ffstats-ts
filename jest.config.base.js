const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@ffstats/(.*)': path.join(__dirname, 'libs', '$1')
  }
};
