import * as connection from './connection'
import {SingleModel as SingleModel} from './baseModels/SingleModel'
import {EdgeModel as EdgeModel} from './baseModels/EdgeModel'
import {CollectionModel as CollectionModel} from './baseModels/CollectionModel'

function init(config) {
  return connection.configure(config)
}

module.exports = {
  init: init,
  getConnection: connection.getConnection,
  SingleModel: SingleModel,
  EdgeModel: EdgeModel,
  CollectionModel: CollectionModel
}
