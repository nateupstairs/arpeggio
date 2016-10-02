/**
 * Adapter
 */

var adapter = false

export function init(_adapter) {
  adapter = _adapter
}

export function getAdapter() {
  return adapter
}
