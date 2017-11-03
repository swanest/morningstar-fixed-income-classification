const data = require('../data/data.json'),
    index = require('../data/data-index.json'),
    strongIndex = require('../data/data-index-strong.json'),
    _ = require('lodash');

const MIN_CODE_LEN = 2;

function MorningstarFixedIncomeClassificationSystem(data, index, strongIndex) {
    data = _.mapValues(data, v => {
        return deepFreeze(v);
    });
    this._dataList = Object.freeze(Object.values(data));
    this._data = data || {};
    this._index = index || {};
    this._strongIndex = strongIndex || {};
}

MorningstarFixedIncomeClassificationSystem.prototype = {

    all: function () {
        return this._dataList;
    },

    search: function (keywords, type) {
        keywords = (keywords || '').toLowerCase();

        const lowerCaseType = typeof type === 'string' ? type.toLowerCase() : type,
            shortKeywords = keywords.replace(/ /g, '');

        if (this._strongIndex[shortKeywords]) {
            const toReturn = [];
            _.forIn(this._strongIndex[shortKeywords], (v, code) => {
                const d = this._data[code];
                if (lowerCaseType !== undefined && d.type.toLowerCase() !== lowerCaseType) {
                    return;
                }
                toReturn.push(d);
            });
            if (toReturn.length > 0) {
                return toReturn;
            }
        }

        const items = [];
        const results = this._index[keywords] || {};

        for (let code in results) {
            if (results.hasOwnProperty(code)) {
                const d = this._data[code];
                if (lowerCaseType !== undefined && d.type.toLowerCase() !== lowerCaseType) {
                    continue;
                }
                items.push(_.assign({ score: results[code] }, d));
            }
        }

        return items.sort(sortByScore);
    },

    find: function (code) {
        return this._data[code];
    },

    above: function (code) {
        code = code + '';
        const results = [];
        for (let i = code.length; i >= MIN_CODE_LEN; i--) {
            const result = this._data[code.substr(0, i)];
            if (result) {
                results.push(result);
            }
        }
        return results;
    },

    below: function (code) {
        code = code + '';
        const results = [];
        for (let p in this._data) {
            if (this._data.hasOwnProperty(p)) {
                if (new RegExp('^' + code).test(p)) {
                    results.push(this._data[p]);
                }
            }
        }
        return results;
    }
};

function deepFreeze(obj) {
    // Retrieve the property names defined on obj
    const propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    propNames.forEach(function (name) {
        const prop = obj[name];

        // Freeze prop if it is an object
        if (typeof prop === 'object' && prop !== null)
            deepFreeze(prop);
    });

    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
}

function sortByScore(a, b) {
    return a.score === b.score ? 0 : a.score > b.score ? -1 : 1;
}

module.exports = new MorningstarFixedIncomeClassificationSystem(data, index, strongIndex);