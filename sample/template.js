'use strict';

var builder = require('../');
var $t = '  ';
var $n = '\n';
var noop = function() {};

module.exports = {
  tab: '  ',
  noop: 'function() {}',
  callback: 'callback = callback || noop',
  bindToIterator: 'var _iterator = thisArg ? iterator.bind(thisArg) : iterator'
};
