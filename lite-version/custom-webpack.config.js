const path = require('path');

module.exports = {
  resolve: {
    alias: {
      querystring: path.resolve(__dirname, 'node_modules/querystring')
    }
  }
};
