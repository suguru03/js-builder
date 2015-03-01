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
  collection: {
    check: {
      array: "Array.isArray(collection)",
      object: "collection && typeof collection === 'object'",
      size: "!size"
    },
    size: {
      array: "size = collection.length",
      object: "var keys = Object.keys(collection); size = keys.length"
    }
  },
  each: {
    init: "var size; var completed = 0",
    array: "_arrayEach(collection, iterate)",
    object: "_objectEach(collection, iterate, keys)",
    iterator: "function iterate(item) {" +
    "  _iterator(item, once(done));" +
    "}",
    done: '' // ↓
  },
  eachSeries: {
    init: "var size, iterate, called; var completed = 0",
    array: "iterate = function() { called = false; _iterator(collection[completed], done); }",
    object: "iterate = function() { called = false; _iterator(collection[keys[completed]], done); }",
    done: '' // ↓
  }
};

config.each.done = builder.init().base(function done(err, bool) {
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

config.eachSeries.done = builder.init().base(function done(err, bool) {
  if (called) {
    throw new Error('Callback was already called.');
  }
  called = true;
  if (err) {
    return callback(err);
  }
  if (++completed === size) {
    return callback();
  }
  if (bool === false) {
    return callback();
  }
  iterate();
}).get();

module.exports = require('../../template').resolve(config);
