#!/usr/bin/env node

const tokenizer = require('text-tokenize'),
    fs = require('fs'),
    builder = require('./builder'),
    DATA_DIR = process.cwd() + '/data',
    data = require(DATA_DIR + '/data'),
    WEIGHTED_PROPS = ['code', 'name', 'description'];

console.log('Building strong index');

const strongIndex = builder.build({
    collection: data,
    properties: ['name'],
    tokenizer: function (value) {
        return [value.toLowerCase().replace(/ /g, '')];
    }
});

console.log('Writing file');

fs.writeFile(DATA_DIR + '/data-index-strong.json', JSON.stringify(strongIndex), function (err) {
    if (err) throw err;
    console.log('Strong index successfully written to file!');
});

console.log('Building weaker index');

const index = builder.build({
    collection: data,
    properties: WEIGHTED_PROPS,
    tokenizer: function (value) {
        return tokenizer(value);
    }
});

console.log('Writing file');

fs.writeFile(DATA_DIR + '/data-index.json', JSON.stringify(index), function (err) {
    if (err) throw err;
    console.log('Index successfully written to file!');
});