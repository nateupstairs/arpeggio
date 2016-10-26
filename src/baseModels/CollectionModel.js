/**
 * Collection Model
 */

var Boom = require('boom')
var _ = require('lodash')

import * as adapter from '../adapter'

export class CollectionModel {

  constructor(baseModel) {
    this.models = []
    this.baseModel = baseModel
    this.subModels = {}
    this.type = new baseModel().type
    this.adapter = adapter.getAdapter()
  }

  async query(...args) {
    try {
      let result = await this.adapter.query(args)

      if (!result) {
        return false
      }
      this.cursor = result.cursor
      if (result.results.length > 0) {
        result.results.forEach(modelData => {
          let model = new this.baseModel()

          model.ingest(modelData.data)
          model.key = modelData.key
          this.models.push(model)
          this._idMap = this.adapter.mapIds(this.models)
        })
        return this
      }
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  buildQuery() {
    return this.adapter.buildQuery(this.type)
  }

  async fetch(...args) {
    try {
      let result = await this.adapter.readMany(this.type, args)

      if (!result) {
        return false
      }
      if (result.length > 0) {
        result.forEach(modelData => {
          let model = new this.baseModel()

          model.ingest(modelData.data)
          model.key = modelData.key
          this.models.push(model)
          this._idMap = this.adapter.mapIds(this.models)
        })
        return this
      }
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  async save() {
    for (let model of this.models) {
      await model.save()
    }
    return this
  }

  async destroy() {
    let keysToDelete = []

    this.models.forEach(m => {
      keysToDelete.push(m.key)
    })
    await this.adapter.destroyMany(this.type, keysToDelete)
    return this
  }

  async checkUniqueness(field, value) {
    await this.query(
      this.buildQuery().filter(field, value)
    )
    if (this.models.length > 0) {
      throw Boom.conflict('uniqueness conflict')
    }
    return this
  }

  byId(id) {
    if (!this._idMap) {
      return false
    }
    return this.adapter.byId(this._idMap, id)
  }

  report(field) {
    return this.models.map(m => m.field)
  }

  async load(field) {
    if (this.submodels[field]) {
      let subModels = new this.submodels[field]['model']()
      let key = this.submodels[field]['key']
      let idList = []

      this.models.forEach(m => {
        idList.push(m.report(key))
      })
      idList = _.compact(idList)
      idList = _.uniq(idList)
      if (idList.length) {
        await subModels.fetch(idList)
      }
      this.models.forEach(m => {
        m.addSubmodel(field, subModels.byId(m.report(key)))
      })
    }
    return this
  }

  toJSON() {
    let localData = []

    this.models.forEach(m => {
      localData.push(m.toJSON())
    })
    return localData
  }

}
