'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var builder = require('../');
var dirpath = path.resolve(__dirname, 'neo-async');
var encoding = {
  encoding: 'utf8'
};

var base = fs.readFileSync(path.resolve(dirpath, 'base.js'), encoding).replace(/\"/g, '');
var main = fs.readFileSync(path.resolve(dirpath, 'main.js'), encoding).replace(/\"/g, '');

var conf = _.assign({}, require('./template'), require('./neo-async/conf/config'));

var templates = {
  main: main
};
var funcTemplates = {};
_.forEach(fs.readdirSync(path.resolve(dirpath, 'collection')), function(filename) {
  var key = _.trimRight(filename, '.js');
  funcTemplates[key] = fs.readFileSync(path.resolve(dirpath, 'collection', filename), encoding).replace(/\"/g, '');
});


var result = builder
.base(base)
.setFuncTemplate(funcTemplates)
.setTemplate(templates)
.set(conf)
.create()
.beautify()
.export(conf.filepath)
.get();

console.log(result);
