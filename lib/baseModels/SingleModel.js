'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _connection = require('../connection');

var connection = _interopRequireWildcard(_connection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base Model
 */

var Joi = require('joi');
var Boom = require('boom');
var base64 = require('urlsafe-base64');
var _ = require('lodash');

var SingleModel = exports.SingleModel = function () {
  function SingleModel(table) {
    _classCallCheck(this, SingleModel);

    this.isNew = true;
    this.timestamps = false;
    this.data = {};
    this.events = {};
    this.prevData = {};
    this.table = table;
    this.children = {};
    this.meta = {};
    this.Joi = Joi;
    this.connection = connection.getConnection();
  }

  _createClass(SingleModel, [{
    key: 'fetch',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var key,
            value,
            params,
            result,
            cursor,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                key = void 0;
                value = void 0;
                params = {};


                if (_args.length == 1) {
                  key = '_key';
                  value = _args.length <= 0 ? undefined : _args[0];
                } else {
                  key = _args.length <= 0 ? undefined : _args[0];
                  value = _args.length <= 1 ? undefined : _args[1];
                }
                _context.prev = 4;
                result = void 0;
                _context.next = 8;
                return this.connection.database.query('\n          FOR i IN @@table\n            FILTER i.@key == @value\n            RETURN i\n        ', {
                  '@table': this.table,
                  key: key,
                  value: value
                });

              case 8:
                cursor = _context.sent;

                if (cursor._result.length) {
                  _context.next = 11;
                  break;
                }

                throw Boom.notFound();

              case 11:
                _context.next = 13;
                return cursor.next();

              case 13:
                result = _context.sent;

                this.isNew = false;
                this.assignData(result);
                return _context.abrupt('return', this);

              case 19:
                _context.prev = 19;
                _context.t0 = _context['catch'](4);
                throw Boom.wrap(_context.t0);

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 19]]);
      }));

      function fetch(_x) {
        return ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'query',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(aql, params) {
        var result, cursor;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = Object.assign({
                  '@table': this.table
                }, params);

                _context2.prev = 1;
                result = void 0;
                _context2.next = 5;
                return this.connection.database.query(aql, params);

              case 5:
                cursor = _context2.sent;

                if (cursor._result.length) {
                  _context2.next = 8;
                  break;
                }

                throw Boom.notFound();

              case 8:
                _context2.next = 10;
                return cursor.next();

              case 10:
                result = _context2.sent;

                this.isNew = false;
                this.assignData(result);
                return _context2.abrupt('return', this);

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2['catch'](1);
                throw Boom.wrap(_context2.t0);

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 16]]);
      }));

      function query(_x2, _x3) {
        return ref.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'rawQuery',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(aql, params) {
        var result, cursor;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                result = void 0;
                _context3.next = 4;
                return this.connection.database.query(aql, params);

              case 4:
                cursor = _context3.sent;
                _context3.next = 7;
                return cursor.all();

              case 7:
                result = _context3.sent;
                return _context3.abrupt('return', result);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3['catch'](0);
                throw Boom.wrap(_context3.t0);

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 11]]);
      }));

      function rawQuery(_x4, _x5) {
        return ref.apply(this, arguments);
      }

      return rawQuery;
    }()
  }, {
    key: 'assignData',
    value: function assignData(inData) {
      var _this = this;

      var data = Object.assign({}, inData);

      if (this.submodels) {
        this.submodels.forEach(function (s) {
          var key = s[0];
          var Model = s[1];

          if (data[key]) {
            var keyData = data[key];

            delete data[key];
            if (_.isArray(keyData)) {
              (function () {
                _this.children[key] = [];
                var collection = new Model();

                _this.children[key] = collection;
                keyData.forEach(function (d) {
                  var model = new collection.baseModel();

                  model.ingest(d);
                  collection.models.push(model);
                });
              })();
            } else {
              var model = new Model();

              model.ingest(keyData);
              _this.children[key] = model;
            }
          }
        });
      }
      this.prevData = data;
      Object.assign(this.data, data);
    }
  }, {
    key: 'destroy',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var cursor;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.triggerEvent('beforeDestroy');

              case 3:
                _context4.next = 5;
                return this.connection.database.query('\n          REMOVE @key in @@table\n        ', {
                  '@table': this.table,
                  key: this.data._key
                });

              case 5:
                cursor = _context4.sent;
                _context4.next = 8;
                return this.triggerEvent('afterDestroy');

              case 8:
                return _context4.abrupt('return', this);

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4['catch'](0);
                throw Boom.notFound();

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 11]]);
      }));

      function destroy() {
        return ref.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'save',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var data, cursor;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                data = this.format();
                cursor = void 0;
                _context5.prev = 2;
                _context5.next = 5;
                return this.triggerEvent('beforeSave');

              case 5:
                this.updateTimestamps();
                _context5.next = 8;
                return this.validate();

              case 8:
                if (!this.isNew) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 11;
                return this.connection.database.query('\n            INSERT @data IN @@table\n              RETURN NEW\n          ', {
                  '@table': this.table,
                  data: data
                });

              case 11:
                cursor = _context5.sent;
                _context5.next = 17;
                break;

              case 14:
                _context5.next = 16;
                return this.connection.database.query('\n            UPDATE @key\n              WITH @data IN @@table\n              RETURN NEW\n          ', {
                  '@table': this.table,
                  key: this.data._key,
                  data: data
                });

              case 16:
                cursor = _context5.sent;

              case 17:
                this.isNew = false;
                this.data = cursor._result[0];
                _context5.next = 21;
                return this.triggerEvent('afterSave');

              case 21:
                return _context5.abrupt('return', this);

              case 24:
                _context5.prev = 24;
                _context5.t0 = _context5['catch'](2);
                throw Boom.wrap(_context5.t0);

              case 27:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 24]]);
      }));

      function save() {
        return ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'format',
    value: function format() {
      return this.data;
    }
  }, {
    key: 'validate',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var rules, data, options;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                rules = this.rules;
                data = this.format();
                options = {
                  abortEarly: false
                };
                return _context6.abrupt('return', new Promise(function (resolve, reject) {
                  if (!rules) {
                    return resolve();
                  }
                  return Joi.validate(data, rules, options, function (err, value) {
                    if (err) {
                      return reject(Boom.badData(err.message, err));
                    }
                    return resolve(value);
                  });
                }));

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function validate() {
        return ref.apply(this, arguments);
      }

      return validate;
    }()
  }, {
    key: 'set',
    value: function set(obj) {
      return Object.assign(this.data, obj);
    }
  }, {
    key: 'ingest',
    value: function ingest(d) {
      this.isNew = false;
      this.assignData(d);
      return this;
    }
  }, {
    key: 'updateTimestamps',
    value: function updateTimestamps() {
      this.data.updatedAt = new Date();
      if (this.isNew) {
        this.data.createdAt = new Date();
      }
    }
  }, {
    key: 'keyToId',
    value: function keyToId(key) {
      return this.table + '/' + key;
    }
  }, {
    key: 'triggerEvent',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(eventName) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this.events[eventName]) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt('return', false);

              case 2:
                _context7.next = 4;
                return this[this.events[eventName]]();

              case 4:
                return _context7.abrupt('return', _context7.sent);

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function triggerEvent(_x6) {
        return ref.apply(this, arguments);
      }

      return triggerEvent;
    }()
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this2 = this;

      var currentData = Object.assign({}, this.data);
      var localData = {};
      var hidden = ['_rev', '_key'];

      if (currentData._key) {
        localData._id = currentData._key;
        delete currentData._id;
      }
      localData = Object.assign(localData, currentData);
      if (this.hidden) {
        hidden = hidden.concat(this.hidden);
      }
      hidden.forEach(function (h) {
        delete localData[h];
      });

      var _loop = function _loop(key) {
        var modelData = _this2.children[key];

        if (_.isArray(modelData)) {
          localData[key] = [];
          modelData.forEach(function (m) {
            localData[key].push(m.toJSON());
          });
        } else {
          localData[key] = modelData.toJSON();
        }
      };

      for (var key in this.children) {
        _loop(key);
      }
      for (var _key in this.meta) {
        localData[_key] = this.meta[_key];
      }
      return localData;
    }
  }]);

  return SingleModel;
}();