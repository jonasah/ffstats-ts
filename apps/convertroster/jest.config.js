const base = require('../../jest.config.base.js');
const packageJson = require('./package');

module.exports = {
  ...base,
  displayName: packageJson.name
};
