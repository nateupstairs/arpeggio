/**
 * Base Model
 */

var Joi = require('joi')
var Boom = require('boom')
var base64 = require('urlsafe-base64')
var _ = require('lodash')

import * as adapter from '../adapter'

export class SingleModel {

  constructor(type) {
    this.adapter = adapter.getAdapter()
    this.type = type
    this.isNew = true
    this.timestamps = false
    this.subModels = {}
    this.key = false
    this.data = {}
    this.events = {}
    this.prevData = {}
    this.children = {}
    this.meta = {}
    this.Joi = Joi
  }

  async fetch(...args) {
    try {
      let result = await this.adapter.read(this.type, args)

      if (!result) {
        throw Boom.notFound()
      }
      else {
        this.key = result.key
        this.assignData(result.data)
        this.isNew = false
        return this
      }
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  async query(...args) {
    try {
      await this.adapter.query(this.type, args)
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  assignData(inData) {
    let data = Object.assign({}, inData)

    this.parseSubmodels()
    this.prevData = data
    Object.assign(this.data, data)
  }

  parseSubmodels() {
    if (this.submodels) {
      Object.keys(this.submodels).forEach(s => {
        let key = s[0]
        let Model = s[1]

        if (this.data[key]) {
          let keyData = this.data[key]

          delete this.data[key]
          if (_.isArray(keyData)) {
            this.children[key] = []
            let collection = new Model()

            this.children[key] = collection
            keyData.forEach(d => {
              let model = new collection.baseModel()

              model.ingest(d)
              collection.models.push(model)
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
  }

  async destroy() {
    try {
      await this.adapter.destroy(this.type, this.key)
    }
    catch (err) {
      throw Boom.wrap(err)
    }
  }

  async save(...args) {
    let data = this.format()

    try {
      let validated

      await this.triggerEvent('beforeSave')
      this.updateTimestamps()
      validated = await this.validate()
      this.data = validated
      if (this.isNew) {
        this.key = await this.adapter.create(this.type, args, this.data)
      }
      else {
        await this.adapter.update(this.type, this.key, this.data)
      }
      this.isNew = false
      await this.triggerEvent('afterSave')
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
        return resolve(data)
      }
      return Joi.validate(data, rules, options, function(err, value) {
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

  setMeta(field, value) {
    this.meta[field] = value
  }

  ingest(d) {
    this.isNew = false
    this.assignData(d)
    return this
  }

  updateTimestamps() {
    let timestamp = Date.now()

    timestamp = timestamp / 1000
    this.data.updatedAt = timestamp
    if (this.isNew) {
      this.data.createdAt = timestamp
    }
  }

  async triggerEvent(eventName) {
    if (!this.events[eventName]) {
      return false
    }
    return await this[this.events[eventName]]()
  }

  report(field) {
    return this.data[field]
  }

  get(field) {
    return this.report(field)
  }

  getKey() {
    return this.adapter.getKey(this.key)
  }

  addSubmodel(field, model) {
    if (this.submodels[field]) {
      this.children[field] = model
    }
  }

  async load(field, id) {
    if (this.submodels[field]) {
      let model = new this.submodels[field]['model']()
      let key = id || this.get(this.submodels[field]['key'])

      await model.fetch(key)
      this.addSubmodel(field, model)
    }
  }

  toJSON() {
    let _id = this.getKey()
    let currentData = Object.assign({
      _id: _id
    }, this.data)
    let localData = {}

    if (currentData._key) {
      localData._id = currentData._key
      delete currentData._id
    }
    localData = Object.assign(localData, currentData)
    if (this.hidden) {
      this.hidden.forEach(h => {
        delete localData[h]
      })
    }
    for (let key in this.children) {
      let modelData = this.children[key]

      if (_.isArray(modelData)) {
        localData[key] = []
        modelData.forEach(m => {
          localData[key].push(m.toJSON())
        })
      }
      else if (_.isObject(modelData)) {
        localData[key] = modelData.toJSON()
      }
      else {
        localData[key] = null
      }
    }
    for (let key in this.meta) {
      if (!localData._meta) {
        localData._meta = {}
      }
      localData._meta[key] = this.meta[key]
    }
    return localData
  }

}
