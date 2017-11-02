#!/usr/bin/env node

const tokenizer = require('text-tokenize');
var DATA_DIR = process.cwd() + '/data';
var WEIGHTED_PROPS = ['code', 'name', 'description'];

var fs = require('fs');
var builder = require('./builder')
var data = require(DATA_DIR + '/data');

console.log('Building index');

var index = builder.build({
    collection: data,
    properties: WEIGHTED_PROPS,
    tokenizer: function (value, property) {
        const tokenized = tokenizer(value);
        if (property === 'name') {
            return [value.toLowerCase()].concat(tokenized);
        }
        return tokenized;
    }
})

console.log('Writing file')

fs.writeFile(DATA_DIR + '/data-index.json', JSON.stringify(index), function (err) {
    if (err) throw err;
    console.log('Index successfully written to file!');
});