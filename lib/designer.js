'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.design = undefined;

var design = exports.design = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(config) {
    var conn, database, collectionData, collectionList, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, c, collection, result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, i;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            conn = connection.getConnection();
            database = conn.database;
            _context.next = 4;
            return database.listCollections();

          case 4:
            collectionData = _context.sent;
            collectionList = [];


            collectionData.forEach(function (c) {
              collectionList.push(c.name);
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 10;
            _iterator = config[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 51;
              break;
            }

            c = _step.value;

            if (!(collectionList.indexOf(c.name) < 0)) {
              _context.next = 48;
              break;
            }

            collection = void 0;
            result = void 0;


            if (c.type === 'document') {
              collection = database.collection(c.name);
            } else {
              collection = database.edgeCollection(c.name);
            }
            _context.next = 20;
            return collection.create();

          case 20:
            result = _context.sent;

            if (!c.indexes) {
              _context.next = 48;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 25;
            _iterator2 = c.indexes[Symbol.iterator]();

          case 27:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 34;
              break;
            }

            i = _step2.value;
            _context.next = 31;
            return collection.createIndex(i);

          case 31:
            _iteratorNormalCompletion2 = true;
            _context.next = 27;
            break;

          case 34:
            _context.next = 40;
            break;

          case 36:
            _context.prev = 36;
            _context.t0 = _context['catch'](25);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 40:
            _context.prev = 40;
            _context.prev = 41;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 43:
            _context.prev = 43;

            if (!_didIteratorError2) {
              _context.next = 46;
              break;
            }

            throw _iteratorError2;

          case 46:
            return _context.finish(43);

          case 47:
            return _context.finish(40);

          case 48:
            _iteratorNormalCompletion = true;
            _context.next = 12;
            break;

          case 51:
            _context.next = 57;
            break;

          case 53:
            _context.prev = 53;
            _context.t1 = _context['catch'](10);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 57:
            _context.prev = 57;
            _context.prev = 58;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 60:
            _context.prev = 60;

            if (!_didIteratorError) {
              _context.next = 63;
              break;
            }

            throw _iteratorError;

          case 63:
            return _context.finish(60);

          case 64:
            return _context.finish(57);

          case 65:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[10, 53, 57, 65], [25, 36, 40, 48], [41,, 43, 47], [58,, 60, 64]]);
  }));

  return function design(_x) {
    return ref.apply(this, arguments);
  };
}();

var _connection = require('./connection');

var connection = _interopRequireWildcard(_connection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Designer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */