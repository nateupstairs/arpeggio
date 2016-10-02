'use strict';

var _adapter = require('./adapter');

var adapter = _interopRequireWildcard(_adapter);

var _SingleModel = require('./baseModels/SingleModel');

var _CollectionModel = require('./baseModels/CollectionModel');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var assert = require('assert');

var config;

function init(_config) {
  assert(_config.adapter, 'Arpeggio: .adapter must be set');

  config = _config;
  return adapter.init(_config.adapter);
}

module.exports = {
  init: init,
  config: config,
  SingleModel: _SingleModel.SingleModel,
  CollectionModel: _CollectionModel.CollectionModel
};