(function() {

  'use strict';

  var root = this;
  var previos_async = root && root.async;
  var noop = function() {};

  var objectTypes = {
    'function': true,
    'object': true
  };

  var _nextTick;
  var _setImmediate;
  createImmediate();

  var async = {
    VERSION: '0.6.1',

    // Collections
    each: each,
    eachSeries: eachSeries,
    eachLimit: eachLimit,
    forEach: each,
    forEachSeries: eachSeries,
    forEachLimit: eachLimit,
    map: map,
    mapSeries: mapSeries,
    mapLimit: mapLimit,
    mapValues: mapValues,
    mapValuesSeries: mapValuesSeries,
    mapValuesLimit: mapValuesLimit,
    filter: filter,
    filterSeries: filterSeries,
    filterLimit: filterLimit,
    select: filter,
    selectSeries: filterSeries,
    selectLimit: filterLimit,
    reject: reject,
    rejectSeries: rejectSeries,
    rejectLimit: rejectLimit,
    detect: detect,
    detectSeries: detectSeries,
    detectLimit: detectLimit,
    pick: pick,
    pickSeries: pickSeries,
    pickLimit: pickLimit,
    reduce: reduce,
    inject: reduce,
    foldl: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    transform: transform,
    transformSeries: transformSeries,
    transformLimit: transformLimit,
    sortBy: createSortBy(),
    sortBySeries: createSortBy('series'),
    sortByLimit: createSortBy('limit'),
    some: some,
    someSeries: someSeries,
    someLimit: someLimit,
    any: some,
    every: every,
    all: every,
    everySeries: everySeries,
    everyLimit: everyLimit,
    concat: concat,
    concatSeries: concatSeries,
    concatLimit: concatLimit,

    // Control Flow
    parallel: parallel,
    series: series,
    parallelLimit: parallelLimit,
    waterfall: waterfall,
    whilst: whilst,
    doWhilst: doWhilst,
    until: until,
    doUntil: doUntil,
    forever: forever,
    compose: compose,
    seq: seq,
    applyEach: createApplyEach(),
    applyEachSeries: createApplyEach('series'),
    queue: queue,
    priorityQueue: priorityQueue,
    cargo: cargo,
    auto: auto,
    retry: retry,
    iterator: iterator,
    apply: apply,
    nextTick: _nextTick,
    setImmediate: _setImmediate,
    times: times,
    timesSeries: timesSeries,
    timesLimit: timesLimit,

    // Utils
    memoize: memoize,
    unmemoize: unmemoize,
    log: createLogger('log'),
    dir: createLogger('dir'),
    createLogger: createLogger,
    noConflict: noConflict,
    eventEmitter: eventEmitter,
    EventEmitter: EventEmitter
  };

  if (objectTypes[typeof define] && define && define.amd) {
    // AMD / RequireJS
    define([], function() {
      return async;
    });
  } else if (objectTypes[typeof module] && module && module.exports) {
    // Node.js
    module.exports = async;
  } else if (root && objectTypes[typeof root.async]) {
    root.neo_async = async;
  } else {
    root.async = async;
  }

  function each(collection, iterator, callback, thisArg) {

    callback = callback || noop;
    var size;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      _arrayEach(collection, iterate);
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      _objectEach(collection, iterate, keys);
    } else {
      callback();
    }

    function iterate(item) {
      _iterator(item, once(done));
    }

    function done(err, bool) {
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
    }
  }

}).call(this);