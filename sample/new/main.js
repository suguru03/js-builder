'use strict';

const path = require('path');

const Builder = require('../../lib/es6/builder');

//files
const base = path.resolve(__dirname, '../../', 'sample/new/async.js');
const sample = path.resolve(__dirname, '../../', 'sample/new/sample.js');

let builder = new Builder();

builder.src(sample).build();

