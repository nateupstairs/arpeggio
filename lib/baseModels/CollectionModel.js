'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _connection = require('../connection');

var connection = _interopRequireWildcard(_connection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Collection Model
 */

var Boom = require('boom');

var CollectionModel = exports.CollectionModel = function () {
  function CollectionModel(baseModel) {
    _classCallCheck(this, CollectionModel);

    this.models = [];
    this.baseModel = baseModel;
    this.table = new baseModel().table;
    this.rawQuery = new baseModel().rawQuery;
    this.connection = connection.getConnection();
  }

  _createClass(CollectionModel, [{
    key: 'query',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(aql, params) {
        var _this = this;

        var result, cursor;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                result = void 0;
                cursor = void 0;


                params = Object.assign({
                  '@table': this.table
                }, params);
                _context.next = 5;
                return this.connection.database.query(aql, params);

              case 5:
                cursor = _context.sent;
                return _context.abrupt('return', cursor.all().then(function (result) {
                  result.forEach(function (modelData) {
                    var model = new _this.baseModel();

                    model.ingest(modelData);
                    _this.models.push(model);
                  });
                  return _this;
                }));

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function query(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'save',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, model;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 3;
                _iterator = this.models[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 12;
                  break;
                }

                model = _step.value;
                _context2.next = 9;
                return model.save();

              case 9:
                _iteratorNormalCompletion = true;
                _context2.next = 5;
                break;

              case 12:
                _context2.next = 18;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 18:
                _context2.prev = 18;
                _context2.prev = 19;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 21:
                _context2.prev = 21;

                if (!_didIteratorError) {
                  _context2.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context2.finish(21);

              case 25:
                return _context2.finish(18);

              case 26:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 14, 18, 26], [19,, 21, 25]]);
      }));

      function save() {
        return ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, model;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 3;
                _iterator2 = this.models[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context3.next = 12;
                  break;
                }

                model = _step2.value;
                _context3.next = 9;
                return model.destroy();

              case 9:
                _iteratorNormalCompletion2 = true;
                _context3.next = 5;
                break;

              case 12:
                _context3.next = 18;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t0;

              case 18:
                _context3.prev = 18;
                _context3.prev = 19;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 21:
                _context3.prev = 21;

                if (!_didIteratorError2) {
                  _context3.next = 24;
                  break;
                }

                throw _iteratorError2;

              case 24:
                return _context3.finish(21);

              case 25:
                return _context3.finish(18);

              case 26:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 14, 18, 26], [19,, 21, 25]]);
      }));

      function destroy() {
        return ref.apply(this, arguments);
      }

      return destroy;
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