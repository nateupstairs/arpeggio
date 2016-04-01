import * as connection from './connection'
import {SingleModel as SingleModel} from './baseModels/SingleModel'
import {CollectionModel as CollectionModel} from './baseModels/CollectionModel'

function init(config) {
  return connection.configure(config)
}

module.exports = {
  init: init,
  getConnection: connection.getConnection,
  SingleModel: SingleModel,
  CollectionModel: CollectionModel
}
