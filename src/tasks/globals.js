var logger = require('winston');
var _ = require('lodash');
var lint = require('../lint');

/**
 * Counts the usage of global variables (window, document).
 */
module.exports = {
    globals: [
        {
            regex: /(\$?window)[^$_a-zA-Z0-9]/g,
            name: 'window'
        },
        {
            regex: /(\$?document)[^$_a-zA-Z0-9]/g,
            name: 'document'
        }
    ],
    filter: function () {
        return lint.isJs();
    },
    firstPass: function () {
        _.each(this.globals, function (global) {
            lint.match(global.regex, function (match) {
                if (!_.startsWith(match[1], '$')) {
                    match.log("'" + global.name + "' should be injected using '$" + global.name + "'.");
                }
            }, this);
        }, this);
    }
};