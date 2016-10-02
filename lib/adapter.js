"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.getAdapter = getAdapter;
/**
 * Adapter
 */

var adapter = false;

function init(_adapter) {
  adapter = _adapter;
}

function getAdapter() {
  return adapter;
}