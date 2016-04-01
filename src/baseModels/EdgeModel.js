/**
 * Edge Model
 */

var Joi = require('joi')
var Boom = require('boom')
var base64 = require('urlsafe-base64')

import * as connection from '../connection'
import {SingleModel as SingleModel} from './SingleModel'

export class EdgeModel extends SingleModel {

  constructor(table) {
    super(table)
  }

  from(id) {
    this.fromId = id
    return this
  }

  to(id) {
    this.toId = id
    return this
  }

  format() {
    let fromToData = {}

    if (this.fromId) {
      fromToData._from = this.fromId
    }
    if (this.toId) {
      fromToData._to = this.toId
    }
    return Object.assign(fromToData, this.data)
  }

}
