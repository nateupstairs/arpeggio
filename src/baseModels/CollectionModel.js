/**
 * Collection Model
 */

var Boom = require('boom')

import * as connection from '../connection'

export class CollectionModel {

  constructor(baseModel) {
    this.models = []
    this.baseModel = baseModel
    this.table = new baseModel().table
    this.rawQuery = new baseModel().rawQuery
    this.connection = connection.getConnection()
  }

  async query(aql, params, options = {}) {
    let localParams = Object.assign({}, params)
    let localOptions = Object.assign({
      appendTableParam: true
    }, options)
    let result
    let cursor

    if (localOptions.appendTableParam !== false) {
      localParams['@table'] = this.table
    }
    cursor = await this.connection.database.query(aql, localParams)

    return cursor.all()
      .then(result => {
        result.forEach(modelData => {
          let model = new this.baseModel()

          model.ingest(modelData)
          this.models.push(model)
        })
        return this
      })
  }

  async save() {
    for (let model of this.models) {
      await model.save()
    }
  }

  async destroy() {
    for (let model of this.models) {
      await model.destroy()
    }
  }

  toJSON() {
    let localData = []

    this.models.forEach(m => {
      localData.push(m.toJSON())
    })
    return localData
  }

}
