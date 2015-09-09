var logger = require('winston');
var _ = require('lodash');
var lint = require('../lint');

/**
 * Counts the usage of global variables (window, document).
 */
module.exports = {
    data: {
        window: 0,
        $window: 0,
        document: 0,
        $document: 0
    },
    globals: [
        {
            regex: /(\$?window)[^$_a-zA-Z0-9]/g,
            counter: 'window'
        },
        {
            regex: /(\$?document)[^$_a-zA-Z0-9]/g,
            counter: 'document'
        }
    ],
    filter: function () {
        return lint.isJs();
    },
    firstPass: function () {
        _.each(this.globals, function (global) {
            lint.each(function (line) {
                var matches;
                while ((matches = global.regex.exec(line)) != null) {
                    var str = matches[1];
                    if (_.startsWith(str, '$')) {
                        this.data['$' + global.counter]++;
                    } else {
                        this.data[global.counter]++;
                    }
                }
            }, this);
        }, this);
    },
    report: function () {
        _.each(this.data, function (value, key) {
            logger.info(key + ': ' + value);
        });
    }
};