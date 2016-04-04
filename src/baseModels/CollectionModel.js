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

  async query(aql, params) {
    let result
    let cursor

    params = Object.assign({
      '@table': this.table
    }, params)
    cursor = await this.connection.database.query(aql, params)

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
