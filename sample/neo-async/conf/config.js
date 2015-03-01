'use strict';

var _ = require('lodash');
var path = require('path');
var builder = require('../../../');

var filename = 'neo-async.js';
var filepath = path.resolve(__dirname, '../', filename);

var config = {
  filename: filename,
  filepath: filepath,
  mode: 'use strict',
  VERSION: '0.6.1',
  init: {
    each: "var size; var completed = 0"
  },
  collection: {
    check: {
      array: "Array.isArray(collection)",
      object: "collection && typeof collection === 'object'",
      size: "!size"
    },
    size: {
      array: "size = collection.length",
      object: "var keys = Object.keys(collection); size = keys.length"
    },
    each: {
      array: "_arrayEach(collection, iterate)",
      object: "_objectEach(collection, iterate, keys)"
    },
    iterator: {
      each: "function iterate(item) {" +
      "  _iterator(item, once(done));" +
      "}"
    }
  }
};

config.collection.each.done = builder.base(function done(err, bool) {
  if (err) {
    callback(err);
    callback = noop;
    return;
  }
  if (bool === false) {
    callback();
    callback = noop;
    return;
  }
  if (++completed === size) {
    callback();
    callback = noop;
  }
}).get();

module.exports = require('../../template').resolve(config);
