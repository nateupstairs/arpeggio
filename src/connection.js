/**
 * Connection Shared Configuration
 */

var url = require('url')
var assert = require('assert')

import arangojs, {Database, aqlQuery} from 'arangojs'

export var connection = false

export function getConnection() {
  return connection
}

export function configure(_config) {
  assert(_config.url, 'Rookery: configuration requires url')
  assert(_config.database, 'Rookery: configuration requires database')

  connection = {}
  connection.database = new Database({
    url: _config.url,
    databaseName: _config.database
  })
  connection.aqlQuery = aqlQuery
}
