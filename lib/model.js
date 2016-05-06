var data = require('../data/data.json');
var index = require('../data/data-index.json');

var MIN_CODE_LEN = 1;
var MAX_CODE_LEN = 8;

function MorningFixedIncomeClassification(data, index) {
    this._data = data || {};
    this._index = index || {};
}

MorningFixedIncomeClassification.prototype = {

    all: function () {
        var items = [];
        for (key in this._data) {
            items.push(this._data[key]);
        }
        return items;
    },

    search: function (keywords, type) {
        keywords = (keywords || '').toLowerCase();

        var items = [];
        var results = index[keywords] || {};

        for (code in results) {
            var object = clone(data[code]);
            object.score = results[code];
            items.push(object);
        }

        if (type) {
            items = items.filter(function (d) {
                return d.type.toLowerCase() === type.toLowerCase();
            });
        }

        return items.sort(sortByScore);
    },

    find: function (code) {
        return data[code];
    },

    above: function (code) {
        code = code + '';
        var results = [];
        for (var i = code.length; i >= MIN_CODE_LEN; i--) {
            var result = this._data[code.substr(0, i)];
            if (result) results.push(result);
        }
        return results;
    },

    below: function (code) {
        code = code + '';
        var results = [];
        for (var p in this._data) {
            if (new RegExp('^'+code).test(p)) {
                results.push(this._data[p]);
            }
        }
        return results;
    }


}

function clone(obj) {
    if (obj == null || typeof(obj) != 'object') return obj;
    var temp = obj.constructor();
    for (var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

function sortByScore(a, b) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
}

module.exports = new MorningFixedIncomeClassification(data, index);