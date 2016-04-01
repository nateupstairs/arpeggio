/**
 * Collection Model
 */

var request = require('axios')
var Boom = require('boom')

import * as connection from '../connection'

export class CollectionModel {

  constructor(table, baseModel) {
    this.models = []
    this.baseModelGenerator = baseModel
    this.baseModel = new baseModel()
    this.type = table
    this.url = this.baseModel.url
    this.connection = connection.getConnection()
  }

  async getAll(view, paramConfig = {}) {
    let params = Object.assign({
      include_docs: true
    }, paramConfig)

    return request.get(this.url + `_design/${this.type}/_view/${view}`, {
      params: this.baseModel.formatParams(params)
    })
      .then(result => {
        result.data.rows.forEach(modelData => {
          let model = new this.baseModelGenerator()

          model.ingest(modelData.doc)
          this.models.push(model)
        })
        return this
      })
  }

  async query(params ={}) {
    return request.post(this.url + '_find', params)
      .then(result => {
        console.log(result)
        return true
        result.data.rows.forEach(modelData => {
          let model = new this.baseModelGenerator()

          model.ingest(modelData.doc)
          this.models.push(model)
        })
        return this
      })
  }

  async count(view, params = {}) {
    return request.get(this.url + `_design/${this.type}/_view/${view}`, {
      params: this.baseModel.formatParams(params)
    })
      .then(result => {
        if (result.data.rows) {
          this.count = result.data.rows[0].value
          return result.data.rows[0].value
        }
        return 0
      })
      .catch(err => {
        this.count = 0
        return 0
      })
  }

  async delete() {
    let data = []

    this.models.forEach(m => {
      data.push({
        _id: m.data._id,
        _rev: m.data._rev,
        _deleted: true
      })
    })
    return request.post(this.url + '_bulk_docs', {
      docs: data
    })
      .then(result => {
        return this
      })
  }

  toJSON() {
    let localData = []

    this.models.forEach(m => {
      localData.push(m.toJSON())
    })
    return localData
  }

}
