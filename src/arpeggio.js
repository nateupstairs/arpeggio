import * as adapter from './adapter'
import {SingleModel as SingleModel} from './baseModels/SingleModel'
import {CollectionModel as CollectionModel} from './baseModels/CollectionModel'

const assert = require('assert')

var config

function init(_config) {
  assert(_config.adapter, 'Arpeggio: .adapter must be set')

  config = _config
  return adapter.init(_config.adapter)
}

module.exports = {
  init: init,
  config: config,
  SingleModel: SingleModel,
  CollectionModel: CollectionModel
}
