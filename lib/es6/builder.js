'use strict';

const fs = require('fs');

const _ = require('lodash');
const jsbeautifier = require('js-beautify');

const util = require('./util');

const INDENT = 2;
const STATUS = {
  RESOLVE: 'resolve',
  CALL: 'call',
  WORKING: 'working'
};
const CALL = 'call:';

class Builder {

  constructor(opts) {
    opts = opts || {}
    this._src = undefined; // target file
  }
  /**
   * @param {string} src - base file path
   * @param {Object} opts - opts for `fs.readfilesync`
   */
  src(src, opts) {
    opts = _.defaults(opts || {}, {
      encoding: 'utf8'
    });
    this._src = src;
    this._file = fs.readFileSync(src, opts);
    return this;
  }
  build() {
    return this._resolve(this._file);
  }
  /**
   * @private
   */
  _resolve(file) {
    const resolver = new Resolver(file);
    let result = resolver.resolve().result();
    util.forEach(result, (obj) => {
      util.forEach(obj, (value) => {
        console.log(value);
      });
    });
    return this;
  }
}

class Resolver {

  constructor(file, parent) {
    this.map = new Map();
    this._file = file;
    this._file = jsbeautifier(this._file, {
      indent_size: INDENT
    });
    this._lines = this._file.split('\n');
    this._parent = parent;
    this._pos = 0;
    while (parent) {
      parent = parent._parent;
      this._pos++;
    }
  }
  resolve() {
    return this.createVMap();
  }
  createVMap() {
    let map = this.map;
    let v = new V(this._pos);
    util.forEach(this._lines, (line) => {
      if (v.resolve(line)) {
        map.set(v.getName(), v.result());
        v = new V(this._pos);
      }
    });
    util.forEach(map, (obj, key) => {
      if (obj.status === STATUS.RESOLVE) {
        return;
      }
      const resolver = new Resolver(obj.value, this);
      map.set(key, resolver.resolve().result());
    });
    return this;
  }
  result() {
    return this.map;
  }
}

// TODO rename
class V {

  constructor(index) {
    this._name = '__NO_NAME__';
    this._pos =  0;
    this._indent = index * INDENT;
    this._value = '';
    this._status = STATUS.RESOLVE;
  }
  resolve(line) {
    if (!line) {
      return false;
    }
    // かっこいい正規表現で書きたい
    let check = _.every(line.slice(0, this._indent), function(v) {
      return v === ' ';
    });
    if (!check) {
      return false;
    }
    this._value += line;
    if (this._pos === 0) {
      let l = line.replace(/ /g, '');
      if (/^(var|let|const)/.test(l)) {
        // 正規表現でかっこ良く書きたい
        let beforeIndex = /var|let/.test(l) ? 3 : 5;
        let afterIndex = _.get(l.match('='), ['index']);
        this._name = l.slice(beforeIndex, afterIndex).replace(/ /g, '');
      } else if (/^function/.test(l)) {
        let beforeIndex = 8;
        let afterIndex = _.get(l.match(/\(/), ['index']);
        this._name = l.slice(beforeIndex, afterIndex).replace(/ /g, '');
      } else {
        let beforeIndex = 0;
        let afterIndex = _.get(l.match(/\(/), ['index']);
        let name = l.slice(beforeIndex, afterIndex).replace(/ /g, '');
        if (name) {
          console.log(name);
          this._name = CALL + name;
          this._status = STATUS.CALL;
        }
      }
    }
    _.forEach(line, (c) => {
      if (/\(|\{|\[/.test(c)) {
        this._pos++;
      }
      if (/\)|\}|\]/.test(c)) {
        this._pos--;
      }
    });
    if (this._pos > 1 && this._status !== STATUS.CALL) {
      this._status = STATUS.WORKING;
    }
    return this._pos === 0;
  }
  getName() {
    return this._name;
  }
  result() {
    return {
      name: this._name,
      value: this._value,
      status: this._status
    }
  }
}

module.exports = Builder;
