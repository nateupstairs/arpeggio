/**
 * Base Model
 */

var Joi = require('joi')
var Boom = require('boom')
var base64 = require('urlsafe-base64')
var _ = require('lodash')

import * as connection from '../connection'

export class SingleModel {

  constructor(table) {
    this.isNew = true
    this.timestamps = false
    this.data = {}
    this.prevData = {}
    this.table = table
    this.children = {}
    this.meta = {}
    this.Joi = Joi
    this.connection = connection.getConnection()
  }

  async fetch(...args) {
    let key
    let value
    let params = {}

    if (args.length == 1) {
      key = '_key'
      value = args[0]
    }
    else {
      key = args[0]
      value = args[1]
    }
    try {
      let result
      let cursor = await this.connection.database.query(
        `
          FOR i IN @@table
            FILTER i.@key == @value
            RETURN i
        `,
        {
          '@table': this.table,
          key: key,
          value: value
        }
      )

      if (!cursor._result.length) {
        throw Boom.notFound()
      }
      result = await cursor.next()
      this.isNew = false
      this.assignData(result)
      return this
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  async query(aql, params) {
    params = Object.assign({
      '@table': this.table
    }, params)

    try {
      let result
      let cursor = await this.connection.database.query(aql, params)

      if (!cursor._result.length) {
        throw Boom.notFound()
      }
      result = await cursor.next()
      this.isNew = false
      this.assignData(result)
      return this
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  async rawQuery(aql, params) {
    try {
      let result
      let cursor = await this.connection.database.query(aql, params)

      result = await cursor.all()
      return result
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  assignData(inData) {
    let data = Object.assign({}, inData)

    if (this.submodels) {
      this.submodels.forEach(s => {
        let key = s[0]
        let Model = s[1]

        if (data[key]) {
          let keyData = data[key]

          delete data[key]
          if (_.isArray(keyData)) {
            this.children[key] = []

            keyData.forEach(d => {
              let model = new Model()

              model.ingest(d)
              this.children[key].push(model)
            })
          }
          else {
            let model = new Model()

            model.ingest(keyData)
            this.children[key] = model
          }
        }
      })
    }
    this.prevData = data
    Object.assign(this.data, data)
  }

  async destroy() {
    try {
      let cursor = await this.connection.database.query(
        `
          REMOVE @key in @@table
        `,
        {
          '@table': this.table,
          key: this.data._key
        }
      )

      return this
    }
    catch (err) {
      throw Boom.notFound()
    }
  }

  async save() {
    let data = this.format()
    let cursor

    try {
      this.updateTimestamps()
      this.validate()
      if (this.isNew) {
        cursor = await this.connection.database.query(
          `
            INSERT @data IN @@table
              RETURN NEW
          `,
          {
            '@table': this.table,
            data: data
          }
        )
      }
      else {
        cursor = await this.connection.database.query(
          `
            UPDATE @key
              WITH @data IN @@table
              RETURN NEW
          `,
          {
            '@table': this.table,
            key: this.data._key,
            data: data
          }
        )
      }
      this.isNew = false
      this.data = cursor._result[0]
      return this
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  format() {
    return this.data
  }

  async validate() {
    let rules = this.rules
    let data = this.format()
    let options = {
      abortEarly: false
    }

    return new Promise(function(resolve, reject) {
      if (!rules) {
        return resolve()
      }
      return Joi.validate(data, rules, options, function (err, value) {
        if (err) {
          return reject(Boom.badData(err.message, err))
        }
        return resolve(value)
      })
    })
  }

  set(obj) {
    return Object.assign(this.data, obj)
  }

  ingest(d) {
    this.isNew = false
    this.assignData(d)
    return this
  }

  updateTimestamps() {
    this.data.updatedAt = new Date()
    if (this.isNew) {
      this.data.createdAt = new Date()
    }
  }

  toJSON() {
    let currentData = Object.assign({}, this.data)
    let localData = {}
    let hidden = ['_rev', '_key']

    if (currentData._key) {
      localData._id = currentData._key
      delete currentData._id
    }
    localData = Object.assign(localData, currentData)
    if (this.hidden) {
      hidden = hidden.concat(this.hidden)
    }
    hidden.forEach(h => {
      delete localData[h]
    })
    for (let key in this.children) {
      let modelData = this.children[key]

      if (_.isArray(modelData)) {
        localData[key] = []
        modelData.forEach(m => {
          localData[key].push(m.toJSON())
        })
      }
      else {
        localData[key] = modelData.toJSON()
      }
    }
    for (let key in this.meta) {
      localData[key] = this.meta[key]
    }
    return localData
  }

}
