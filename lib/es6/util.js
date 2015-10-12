'use strict';

exports.forEach = function(collection, iterator) {
  if (Array.isArray(collection)) {
    let i = -1;
    let l = collection.length;
    while (++i < l) {
      iterator(collection[i], i);
    }
  } else if (collection[Symbol.iterator]) {
    let iter = collection[Symbol.iterator]();
    let key, value, item;
    while (!(item = iter.next()).done) {
      key = item.value[0];
      value = item.value[1];
      iterator(value, key);
    }
  } else if (typeof collection === 'object') {
    let keys = Object.keys(collection);
    let i = -1;
    let l = keys.length;
    let key;
    while (++i < l) {
      key = keys[i];
      iterator(collection[key], key);
    }
  }
};
