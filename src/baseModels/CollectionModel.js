/**
 * Collection Model
 */

var Boom = require('boom')

import * as adapter from '../adapter'

export class CollectionModel {

  constructor(baseModel) {
    this.models = []
    this.baseModel = baseModel
    this.type = new baseModel().type
    this.adapter = adapter.getAdapter()
  }

  async query(...args) {
    try {
      let result = await this.adapter.query(args)

      if (result) {
        this.cursor = result.cursor
        if (result.results.length > 0) {
          result.results.forEach(modelData => {
            let model = new this.baseModel()

            model.ingest(modelData.data)
            model.key = modelData.key
            this.models.push(model)
          })
          return this
        }
      }
      return false
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  async buildQuery() {
    return this.adapter.buildQuery(this.type)
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
