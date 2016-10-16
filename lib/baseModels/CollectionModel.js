'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _adapter = require('../adapter');

var adapter = _interopRequireWildcard(_adapter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Collection Model
 */

var Boom = require('boom');
var _ = require('lodash');

var CollectionModel = exports.CollectionModel = function () {
  function CollectionModel(baseModel) {
    _classCallCheck(this, CollectionModel);

    this.models = [];
    this.baseModel = baseModel;
    this.subModels = {};
    this.type = new baseModel().type;
    this.adapter = adapter.getAdapter();
  }

  _createClass(CollectionModel, [{
    key: 'query',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this = this;

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
                return this.adapter.query(args);

              case 4:
                result = _context.sent;

                if (result) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', false);

              case 7:
                this.cursor = result.cursor;

                if (!(result.results.length > 0)) {
                  _context.next = 11;
                  break;
                }

                result.results.forEach(function (modelData) {
                  var model = new _this.baseModel();

                  model.ingest(modelData.data);
                  model.key = modelData.key;
                  _this.models.push(model);
                  _this._idMap = _this.adapter.mapIds(_this.models);
                });
                return _context.abrupt('return', this);

              case 11:
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](0);
                throw Boom.wrap(_context.t0);

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 13]]);
      }));

      function query(_x) {
        return _ref.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'buildQuery',
    value: function buildQuery() {
      return this.adapter.buildQuery(this.type);
    }
  }, {
    key: 'fetch',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var _len2,
            args,
            _key2,
            result,
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
                return this.adapter.readMany(this.type, args);

              case 4:
                result = _context2.sent;

                if (result) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt('return', false);

              case 7:
                if (!(result.length > 0)) {
                  _context2.next = 10;
                  break;
                }

                result.forEach(function (modelData) {
                  var model = new _this2.baseModel();

                  model.ingest(modelData.data);
                  model.key = modelData.key;
                  _this2.models.push(model);
                  _this2._idMap = _this2.adapter.mapIds(_this2.models);
                });
                return _context2.abrupt('return', this);

              case 10:
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](0);
                throw Boom.wrap(_context2.t0);

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12]]);
      }));

      function fetch(_x2) {
        return _ref2.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'save',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, model;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 3;
                _iterator = this.models[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 12;
                  break;
                }

                model = _step.value;
                _context3.next = 9;
                return model.save();

              case 9:
                _iteratorNormalCompletion = true;
                _context3.next = 5;
                break;

              case 12:
                _context3.next = 18;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 18:
                _context3.prev = 18;
                _context3.prev = 19;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 21:
                _context3.prev = 21;

                if (!_didIteratorError) {
                  _context3.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context3.finish(21);

              case 25:
                return _context3.finish(18);

              case 26:
                return _context3.abrupt('return', this);

              case 27:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 14, 18, 26], [19,, 21, 25]]);
      }));

      function save() {
        return _ref3.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var keysToDelete;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                keysToDelete = [];


                this.models.forEach(function (m) {
                  keysToDelete.push(m.getKey());
                });
                debugger;
                _context4.next = 5;
                return this.adapter.destroyMany(this.type, keysToDelete);

              case 5:
                return _context4.abrupt('return', this);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function destroy() {
        return _ref4.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'checkUniqueness',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(field, value) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.query(this.buildQuery().filter(field, value));

              case 2:
                if (!(this.models.length > 0)) {
                  _context5.next = 4;
                  break;
                }

                throw Boom.conflict('uniqueness conflict');

              case 4:
                return _context5.abrupt('return', this);

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function checkUniqueness(_x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return checkUniqueness;
    }()
  }, {
    key: 'byId',
    value: function byId(id) {
      if (!this._idMap) {
        return false;
      }
      return this.adapter.byId(this._idMap, id);
    }
  }, {
    key: 'report',
    value: function report(field) {
      return this.models.map(function (m) {
        return m.field;
      });
    }
  }, {
    key: 'load',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(field) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.submodels[field]) {
                  _context7.next = 2;
                  break;
                }

                return _context7.delegateYield(regeneratorRuntime.mark(function _callee6() {
                  var subModels, key, idList;
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          subModels = new _this3.submodels[field]['model']();
                          key = _this3.submodels[field]['key'];
                          idList = [];


                          _this3.models.forEach(function (m) {
                            idList.push(m.report(key));
                          });
                          idList = _.compact(idList);

                          if (!idList.length) {
                            _context6.next = 8;
                            break;
                          }

                          _context6.next = 8;
                          return subModels.fetch(idList);

                        case 8:
                          _this3.models.forEach(function (m) {
                            m.addSubmodel(field, subModels.byId(m.report(key)));
                          });

                        case 9:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this3);
                })(), 't0', 2);

              case 2:
                return _context7.abrupt('return', this);

              case 3:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function load(_x5) {
        return _ref6.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var localData = [];

      this.models.forEach(function (m) {
        localData.push(m.toJSON());
      });
      return localData;
    }
  }]);

  return CollectionModel;
}();