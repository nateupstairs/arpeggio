'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _adapter = require('../adapter');

var adapter = _interopRequireWildcard(_adapter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base Model
 */

var Joi = require('joi');
var Boom = require('boom');
var base64 = require('urlsafe-base64');
var _ = require('lodash');

var SingleModel = exports.SingleModel = function () {
  function SingleModel(type) {
    _classCallCheck(this, SingleModel);

    this.adapter = adapter.getAdapter();
    this.type = type;
    this.isNew = true;
    this.timestamps = false;
    this.subModels = {};
    this.key = false;
    this.data = {};
    this.events = {};
    this.prevData = {};
    this.children = {};
    this.meta = {};
    this.Joi = Joi;
  }

  _createClass(SingleModel, [{
    key: 'fetch',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _len,
            args,
            _key,
            result,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                for (_len = _args.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }

                _context.next = 4;
                return this.adapter.read(this.type, args);

              case 4:
                result = _context.sent;


                this.key = result.key;
                this.assignData(result.data);
                this.isNew = false;
                return _context.abrupt('return', this);

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](0);
                throw Boom.wrap(_context.t0);

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 11]]);
      }));

      function fetch(_x) {
        return _ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'query',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _len2,
            args,
            _key2,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                for (_len2 = _args2.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = _args2[_key2];
                }

                _context2.next = 4;
                return this.adapter.query(this.type, args);

              case 4:
                _context2.next = 9;
                break;

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2['catch'](0);
                throw Boom.wrap(_context2.t0);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 6]]);
      }));

      function query(_x2) {
        return _ref2.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'assignData',
    value: function assignData(inData) {
      var data = Object.assign({}, inData);

      this.parseSubmodels();
      this.prevData = data;
      Object.assign(this.data, data);
    }
  }, {
    key: 'parseSubmodels',
    value: function parseSubmodels() {
      var _this = this;

      if (this.submodels) {
        Object.keys(this.submodels).forEach(function (s) {
          var key = s[0];
          var Model = s[1];

          if (_this.data[key]) {
            var keyData = _this.data[key];

            delete _this.data[key];
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
    }
  }, {
    key: 'destroy',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.adapter.destroy(this.type, this.key);

              case 3:
                _context3.next = 8;
                break;

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3['catch'](0);
                throw Boom.wrap(_context3.t0);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 5]]);
      }));

      function destroy() {
        return _ref3.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'save',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var data,
            validated,
            _len3,
            args,
            _key3,
            _args4 = arguments;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = this.format();
                _context4.prev = 1;
                validated = void 0;
                _context4.next = 5;
                return this.triggerEvent('beforeSave');

              case 5:
                this.updateTimestamps();
                _context4.next = 8;
                return this.validate();

              case 8:
                validated = _context4.sent;

                this.data = validated;

                if (!this.isNew) {
                  _context4.next = 17;
                  break;
                }

                for (_len3 = _args4.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                  args[_key3] = _args4[_key3];
                }

                _context4.next = 14;
                return this.adapter.create(this.type, args, this.data);

              case 14:
                this.key = _context4.sent;
                _context4.next = 19;
                break;

              case 17:
                _context4.next = 19;
                return this.adapter.update(this.type, this.key, this.data);

              case 19:
                this.isNew = false;
                _context4.next = 22;
                return this.triggerEvent('afterSave');

              case 22:
                return _context4.abrupt('return', this);

              case 25:
                _context4.prev = 25;
                _context4.t0 = _context4['catch'](1);
                throw Boom.wrap(_context4.t0);

              case 28:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 25]]);
      }));

      function save(_x3) {
        return _ref4.apply(this, arguments);
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
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var rules, data, options;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                rules = this.rules;
                data = this.format();
                options = {
                  abortEarly: false
                };
                return _context5.abrupt('return', new Promise(function (resolve, reject) {
                  if (!rules) {
                    return resolve(data);
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
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function validate() {
        return _ref5.apply(this, arguments);
      }

      return validate;
    }()
  }, {
    key: 'set',
    value: function set(obj) {
      return Object.assign(this.data, obj);
    }
  }, {
    key: 'setMeta',
    value: function setMeta(field, value) {
      this.meta[field] = value;
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
      var timestamp = Date.now();

      timestamp = timestamp / 1000;
      this.data.updatedAt = timestamp;
      if (this.isNew) {
        this.data.createdAt = timestamp;
      }
    }
  }, {
    key: 'triggerEvent',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(eventName) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.events[eventName]) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt('return', false);

              case 2:
                _context6.next = 4;
                return this[this.events[eventName]]();

              case 4:
                return _context6.abrupt('return', _context6.sent);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function triggerEvent(_x4) {
        return _ref6.apply(this, arguments);
      }

      return triggerEvent;
    }()
  }, {
    key: 'report',
    value: function report(field) {
      return this.data[field];
    }
  }, {
    key: 'get',
    value: function get(field) {
      return this.report(field);
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return this.adapter.getKey(this.key);
    }
  }, {
    key: 'addSubmodel',
    value: function addSubmodel(field, model) {
      if (this.submodels[field]) {
        this.children[field] = model;
      }
    }
  }, {
    key: 'load',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(field, id) {
        var model, key;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.submodels[field]) {
                  _context7.next = 6;
                  break;
                }

                model = new this.submodels[field]['model']();
                key = id || this.get(this.submodels[field]['key']);
                _context7.next = 5;
                return model.fetch(key);

              case 5:
                this.addSubmodel(field, model);

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function load(_x5, _x6) {
        return _ref7.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this2 = this;

      var _id = this.getKey();
      var currentData = Object.assign({
        _id: _id
      }, this.data);
      var localData = {};

      if (currentData._key) {
        localData._id = currentData._key;
        delete currentData._id;
      }
      localData = Object.assign(localData, currentData);
      if (this.hidden) {
        this.hidden.forEach(function (h) {
          delete localData[h];
        });
      }

      var _loop = function _loop(key) {
        var modelData = _this2.children[key];

        if (_.isArray(modelData)) {
          localData[key] = [];
          modelData.forEach(function (m) {
            localData[key].push(m.toJSON());
          });
        } else if (_.isObject(modelData)) {
          localData[key] = modelData.toJSON();
        } else {
          localData[key] = null;
        }
      };

      for (var key in this.children) {
        _loop(key);
      }
      for (var _key4 in this.meta) {
        localData._meta = {};
        localData._meta[_key4] = this.meta[_key4];
      }
      return localData;
    }
  }]);

  return SingleModel;
}();