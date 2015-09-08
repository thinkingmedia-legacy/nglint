var args = require('optjs')();
var logger = require('winston');
var fs = require('fs');
var _ = require('lodash');

/**
 * @type {boolean}
 */
exports.silent = !!args.opt.s || !!args.opt.silent;

/**
 * @type {boolean}
 */
exports.verbose = !!args.opt.verbose;

/**
 * @type {boolean}
 */
exports.version = !!args.opt.v || !!args.opt.version;

/**
 * @type {boolean}
 */
exports.help = !!args.opt.h || !!args.opt.help;

/**
 * @type {boolean}
 */
exports.debug = !!args.opt.d || !!args.opt.debug;
if(exports.debug)
{
    logger.level = 'debug';
}

/**
 * @returns {string}
 */
exports.getVersion = function()
{
    return require(__dirname + "/../package.json").version;
};

exports.showVersion = function()
{
    console.log(exports.getVersion());
};

exports.validate = function()
{
    //if(!fs.existsSync(exports.work))
    //{
    //    throw new Error("Working folder not found: " + exports.work);
    //}
    //
    //if(!fs.existsSync(exports.source))
    //{
    //    throw new Error("Source code folder not found: " + exports.source);
    //}
};

exports.copyright = function()
{
    var version = exports.getVersion();

    console.log('ngInspector version \"' + version + '\"');
    console.log('Copyright (c) 2015. ThinkingMedia. http://www.thinkingmedia.ca');
    console.log('Developed by Mathew Foscarini, support@thinkingmedia.ca');
    console.log('This is free software; see the source for MIT license.');
    console.log('');
};

exports.showConfig = function()
{
    var config = {
        'Work':   exports.work,
        'Source': exports.source,
        'Trace':  exports.trace,
        'Debug':  exports.debug,
        'Output': exports._file
    };
    var size = 0;
    _.each(config, function(value, key)
    {
        size = Math.max(size, key.length + 1);
    });
    _.each(config, function(value, key)
    {
        console.log(_.padLeft(key, size) + ": " + value);
    });
    console.log('');
};

exports.usage = function()
{
    console.log('Usage: ngInspector [options] <path>');
    console.log('');
    console.log('Example: ngInspector ./www/js');
    console.log('');
    console.log('Options:');
    console.log('  -h, --help       shows this usage message');
    console.log('  -v, --version    print version number');
    console.log('  -s, --silent     hides copyright message');
    console.log('  -d, --debug      show debug message');
};
