var args = require('optjs')();
var logger = require('winston');
var fs = require('fs');
var _ = require('lodash');

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
 * @type {string|null}
 */
exports.source = args.argv[0] || null;

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
    if(!fs.existsSync(exports.source))
    {
        throw new Error("Source code folder not found: " + exports.source);
    }
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
    console.log('  -d, --debug      show debug message');
};
