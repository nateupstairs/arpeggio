/**
 * Base Model
 */

var request = require('axios')
var Joi = require('joi')
var Boom = require('boom')
var url = require('url')
var base64 = require('urlsafe-base64')

import * as connection from '../connection'

export class SingleModel {

  constructor(table) {
    this.isNew = true
    this.timestamps = false
    this.data = {}
    this.prevData = {}
    this.table = table
    this.Joi = Joi
    this.request = request
    this.connection = connection.getConnection()
  }

  async fetch(...args) {
    let key
    let value
    let params = {}

    if (args.length == 1) {
      key = '_id'
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
      this.prevData = result
      Object.assign(this.data, result)
      return this
    }
    catch (err) {
      throw Boom.wrap(err)
    }
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
    let data = this.data
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

  async validate() {
    let rules = this.rules
    let data = this.data
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
    this.prevData = d
    Object.assign(this.data, d)
    return this
  }

  updateTimestamps() {
    this.data.updatedAt = new Date()
    if (this.isNew) {
      this.data.createdAt = new Date()
    }
  }

  toJSON() {
    let localData = {}
    let hidden = ['_rev', '_key']

    Object.assign(localData, this.data)
    if (this.hidden) {
      hidden = hidden.concat(this.hidden)
    }
    hidden.forEach(h => {
      delete localData[h]
    })
    return localData
  }

}
