'use strict';

var _connection = require('./connection');

var connection = _interopRequireWildcard(_connection);

var _designer = require('./designer');

var designer = _interopRequireWildcard(_designer);

var _SingleModel = require('./baseModels/SingleModel');

var _EdgeModel = require('./baseModels/EdgeModel');

var _CollectionModel = require('./baseModels/CollectionModel');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function init(config) {
  return connection.configure(config);
}

module.exports = {
  init: init,
  design: designer.design,
  getConnection: connection.getConnection,
  SingleModel: _SingleModel.SingleModel,
  EdgeModel: _EdgeModel.EdgeModel,
  CollectionModel: _CollectionModel.CollectionModel
};