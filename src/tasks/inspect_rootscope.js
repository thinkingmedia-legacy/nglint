var logger = require('winston');
var _ = require('lodash');

var declare_function = /function\s*\([^\)]*\)/g;

var rootScope_property = /\$rootScope\.([\$_a-zA-Z0-9]+)/ig;

/**
 * Counts the occurrences of rootScope usage in the source.
 */
module.exports = {
    name: 'RootScope Inspection',
    data: {
        injected: 0,
        property_usages: 0,
        properties: {},
        reads: 0,
        writes: 0
    },
    process: function (original, /** string */compress, lines) {
        // count how many times $rootScope appears as a parameter on a function. Assume this is an injection.
        var matches = compress.match(declare_function);
        _.each(matches, function (match) {
            if (match.indexOf("$rootScope") !== -1) {
                this.data.injected++;
            }
        }, this);
        // count how many times a $rootScope property is used.
        while ((matches = rootScope_property.exec(compress)) !== null) {
            if (matches) {
                this.data.property_usages++;
                this.data.properties[matches[1]] = ~~this.data.properties[matches[1]] + 1;
            }
        }
        // count how many times $rootScope is on the left or right of an = operator
        _.each(compress.split(";"), function (/** string */line) {
            // This isn't perfect. Split on any =, ==, ===, !==, >=, <=, and assume array count of 2 means an expression.
            var parts = line.split(/=|==|===|!==|<=|>=|-=|\+=/g);
            if (parts.length !== 2) {
                return;
            }
            if (parts[0].indexOf('$rootScope') !== -1) {
                this.data.writes++;
            }
            if (parts[1].indexOf('$rootScope') !== -1) {
                this.data.reads++;
            }
        }, this);
    },
    report: function () {
        _.each(this.data, function (value, key) {
            if (_.isObject(value)) {
                _.each(value, function (value2, key2) {
                    logger.info(key + ': ' + key2 + ' -> ' + value2);
                });
                return;
            }
            logger.info(key + ': ' + value);
        });
    }
};