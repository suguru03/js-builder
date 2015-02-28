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
    }
  }
};

module.exports = _.transform(config, function(result, item, key) {
  (function flatten(item) {
    if (_.isPlainObject(item)) {
      _.forEach(item, function(_item, key) {
        flatten.call({
          key: [this.key, key].join('_')
        }, _item);
      }, this);
    } else {
      result[this.key] = item;
    }
  }).call({
    key: key
  }, item);
});
