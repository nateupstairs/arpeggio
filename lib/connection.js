'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connection = undefined;
exports.getConnection = getConnection;
exports.configure = configure;

var _arangojs = require('arangojs');

var _arangojs2 = _interopRequireDefault(_arangojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Connection Shared Configuration
 */

var url = require('url');
var assert = require('assert');

var connection = exports.connection = false;

function getConnection() {
  return connection;
}

function configure(_config) {
  assert(_config.url, 'Rookery: configuration requires url');
  assert(_config.database, 'Rookery: configuration requires database');

  exports.connection = connection = {};
  connection.database = new _arangojs.Database({
    url: _config.url,
    databaseName: _config.database
  });
  connection.aqlQuery = _arangojs.aqlQuery;
}