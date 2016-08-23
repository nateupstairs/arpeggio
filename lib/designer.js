'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.design = undefined;

var design = exports.design = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(config) {
    var conn, database, collectionData, collectionList, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, c, collection, result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, i;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            conn = connection.getConnection();
            database = conn.database;

            console.log('database', database);
            _context.next = 5;
            return database.listCollections();

          case 5:
            collectionData = _context.sent;
            collectionList = [];


            collectionData.forEach(function (c) {
              collectionList.push(c.name);
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 11;
            _iterator = config[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 52;
              break;
            }

            c = _step.value;

            if (!(collectionList.indexOf(c.name) < 0)) {
              _context.next = 49;
              break;
            }

            collection = void 0;
            result = void 0;


            if (c.type === 'document') {
              collection = database.collection(c.name);
            } else {
              collection = database.edgeCollection(c.name);
            }
            _context.next = 21;
            return collection.create();

          case 21:
            result = _context.sent;

            if (!c.indexes) {
              _context.next = 49;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 26;
            _iterator2 = c.indexes[Symbol.iterator]();

          case 28:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 35;
              break;
            }

            i = _step2.value;
            _context.next = 32;
            return collection.createIndex(i);

          case 32:
            _iteratorNormalCompletion2 = true;
            _context.next = 28;
            break;

          case 35:
            _context.next = 41;
            break;

          case 37:
            _context.prev = 37;
            _context.t0 = _context['catch'](26);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 41:
            _context.prev = 41;
            _context.prev = 42;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 44:
            _context.prev = 44;

            if (!_didIteratorError2) {
              _context.next = 47;
              break;
            }

            throw _iteratorError2;

          case 47:
            return _context.finish(44);

          case 48:
            return _context.finish(41);

          case 49:
            _iteratorNormalCompletion = true;
            _context.next = 13;
            break;

          case 52:
            _context.next = 58;
            break;

          case 54:
            _context.prev = 54;
            _context.t1 = _context['catch'](11);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 58:
            _context.prev = 58;
            _context.prev = 59;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 61:
            _context.prev = 61;

            if (!_didIteratorError) {
              _context.next = 64;
              break;
            }

            throw _iteratorError;

          case 64:
            return _context.finish(61);

          case 65:
            return _context.finish(58);

          case 66:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[11, 54, 58, 66], [26, 37, 41, 49], [42,, 44, 48], [59,, 61, 65]]);
  }));

  return function design(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _connection = require('./connection');

var connection = _interopRequireWildcard(_connection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Designer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */