var fs = require('fs');
var _ = require('lodash');
var logger = require('winston');

function Lint() {
    /**
     * @type {string}
     */
    this.file = null;

    /**
     * @type {string}
     */
    this.pass = null;

    /**
     * @type {string}
     */
    this.original = null;

    /**
     * @type {string[]}
     */
    this.lines = null;

    /**
     * @param {string} file
     */
    this.read = function (file) {
        this.file = file;
        this.original = fs.readFileSync(file, 'utf8');
        this.original = this.original.replace(/\t/g, '    ');
        this.lines = this.original.replace(/[\r]/g, "").split("\n");
    };

    /**
     *
     */
    this.clear = function () {
        this.file = null;
        this.original = null;
        this.lines = null;
    };

    /**
     * @returns {boolean}
     */
    this.isJs = function () {
        return !this.isTest() && _.endsWith(this.file.toLowerCase(), ".js");
    };

    /**
     * @returns {boolean}
     */
    this.isTest = function () {
        return _.endsWith(this.file.toLowerCase(), ".spec.js") || _.endsWith(this.file.toLowerCase(), ".test.js");
    };

    /**
     * @returns {boolean}
     */
    this.isHTML = function () {
        return _.endsWith(this.file.toLowerCase(), ".html");
    };

    /**
     * @param {Number} offset
     * @returns {{line:Number,column:Number}}
     */
    this.getCoordsByOffset = function (offset) {
        var lines = this.original.substr(0, offset).split("\n");
        return {
            line: lines.length,
            column: _.last(lines).length + 1,
            text: this.lines[lines.length - 1]
        }
    };

    /**
     * Executes the callback for each line in the file.
     *
     * @param {function(string)} fn
     * @param {*=} thisArg
     */
    this.each = function (fn, thisArg) {
        for (this.line = 0; this.line < this.lines.length; this.line++) {
            fn.call(thisArg || this, this.lines[this.line]);
        }
    };

    /**
     * Executes the callback for each regexp match.
     *
     * @param {RegExp} regex
     * @param {function(Array)} fn
     * @param {*=} thisArg
     */
    this.match = function (regex, fn, thisArg) {
        var match;
        while ((match = regex.exec(this.original)) != null) {
            // attach a convenient log method
            match.log = function (match, msg) {
                var coords = this.getCoordsByOffset(match.index);
                console.log(this.file + ':' + coords.line + ',' + coords.column);
                console.log(coords.text);
                console.log(Array(coords.column).join(' ') + '^');
                console.log(msg);
                console.log();
            }.bind(this, match);
            fn.call(thisArg, match);
        }
    };
}

var LinkObj = new Lint();
logger.extend(LinkObj);
module.exports = LinkObj;