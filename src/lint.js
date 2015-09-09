var fs = require('fs');
var _ = require('lodash');
var MODES = require('./modes');

module.exports = {
    /**
     * @type {string}
     */
    file: null,
    /**
     * @type {string}
     */
    pass: null,
    /**
     * @type {string}
     */
    original: null,
    /**
     * @type {string}
     */
    compressed: null,
    /**
     * @type {string[]}
     */
    lines: null,

    /**
     * @type {number}
     */
    line: 0,

    /**
     * @type {number}
     */
    column: 0,

    /**
     * @param {string} file
     */
    read: function (file) {
        this.file = file;
        this.original = fs.readFileSync(file, 'utf8');
        this.compressed = this.original.replace(/[\r\n]/g, "");
        this.compressed = this.original.replace(/\t/g, " ");
        this.compressed = this.original.replace(/\s+/g, " ");
        this.lines = this.original.replace(/[\r]/g, "").split("\n");
    },

    /**
     *
     */
    clear: function () {
        this.file = null;
        this.original = null;
        this.compressed = null;
        this.lines = null;
    },

    /**
     * @returns {boolean}
     */
    isJs: function () {
        return !this.isTest() && _.endsWith(this.file.toLowerCase(), ".js");
    },

    /**
     * @returns {boolean}
     */
    isTest: function () {
        return _.endsWith(this.file.toLowerCase(), ".spec.js") || _.endsWith(this.file.toLowerCase(), ".test.js");
    },

    /**
     * @returns {boolean}
     */
    isHTML: function () {
        return _.endsWith(this.file.toLowerCase(), ".html");
    },

    /**
     * @param {number=} mode
     * @returns {string|string[]}
     */
    getSource: function (mode) {
        switch (mode) {
            case MODES.COMPRESSED:
                return this.compressed;
            case MODES.LINES:
                return this.lines;
            case MODES.ORIGINAL:
            default:
                return this.original;
        }
    },

    /**
     * @param {function(string)} fn
     * @param {*=} thisArg
     */
    each: function (fn, thisArg) {
        for (this.line = 0; this.line < this.lines.length; this.line++) {
            fn.call(thisArg || this, this.lines[this.line]);
        }
    },

    /**
     *
     * @param {RegExp} regex
     * @param {function(Array)} fn
     * @param {number=} mode
     * @param {*=} thisArg
     */
    match: function (regex, fn, mode, thisArg) {
        var sources = this.getSource(mode);
        sources = _.isArray(sources) ? sources : [sources];

        var matches;
        while ((matches = global.regex.exec(line)) != null) {
            var str = matches[1];
            if (_.startsWith(str, '$')) {
                this.data['$' + global.counter]++;
            } else {
                this.data[global.counter]++;
            }
        }
    }
};