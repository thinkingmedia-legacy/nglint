var logger = require('winston');
var _ = require('lodash');

var global_window = /(\$?window)[^$_a-zA-Z0-9]/g;
var global_document = /(\$?document)[^$_a-zA-Z0-9]/g;

/**
 * Counts the usage of global variables (window, document).
 */
module.exports = {
    name: 'Global Variables',
    data: {
        window: 0,
        $window: 0,
        document: 0,
        $document: 0
    },
    process: function (original, /** string */compress, lines) {

        var globals = [
            {
                regex: global_window,
                counter: 'window'
            },
            {
                regex: global_document,
                counter: 'document'
            }
        ];

        _.each(globals, function (global) {
            _.each(lines, function (line) {
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