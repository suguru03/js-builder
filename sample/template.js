'use strict';

var _ = require('lodash');
var builder = require('../');
var $t = '  ';
var $n = '\n';
var noop = function() {};

var config = {
  tab: '  ',
  noop: 'function() {}',
  callback: {
    init: 'callback = callback || noop',
    none: 'callback()'
  },
  bindToIterator: 'var _iterator = thisArg ? iterator.bind(thisArg) : iterator'
};

function resolve(config) {
  return _.transform(config, function(result, item, key) {
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
}

module.exports = resolve(config);
module.exports.resolve = resolve;

