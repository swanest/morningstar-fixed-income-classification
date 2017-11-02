var tokenizer = require('text-tokenize');

var DEFAULT_OPTIONS = {
    properties: [],
    collection: {},
    tokenizer:  tokenizer
}

function build (options) {
    options = options || {};

    for (var key in DEFAULT_OPTIONS) {
        if ( !options.hasOwnProperty(key) ) {
            options[key] = DEFAULT_OPTIONS[key];
        }
    }

    var tokenize   = options['tokenizer'];
    var collection = options['collection'];
    var properties = options['properties'];

    var index = {};

    for (var id in collection) {
        var item = collection[id];
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            if (item.hasOwnProperty(property)) {
                var value  = item[property];
                var weight = properties.length - i;
                var tokens = tokenize(value, property);

                for (var j = 0; j < tokens.length; j++) {
                    var token = tokens[j];
                    index[token] = index[token] || {};
                    index[token][id] = index[token][id] || 0;
                    index[token][id] += weight;
                }

            }
        }
    }

    return index;
}

module.exports.build = build;