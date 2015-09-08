require('./bootstrap.js');
var logger = require('winston');
var params = require('./params.js');

if(params.version)
{
    params.showVersion();
    return;
}

if(params.help)
{
    params.usage();
    return;
}

try
{
    params.validate();
}
catch($ex)
{
    console.error("fatal: " + $ex.message);
    return;
}

if(!params.silent)
{
    params.copyright();
    params.showConfig();
}

return;

var glob = require('glob');
var fs = require('fs-extra');
var _ = require('lodash');

// what will be done, and in what order
var tasks = [
    require('./tasks/match_broadcast'),
    require('./tasks/inspect_rootscope'),
    require('./tasks/global_variables')
];

function read(file) {
    var original = fs.readFileSync(file, 'utf8');
    var compressed = original.replace(/[\r\n]/g, "");
    compressed = original.replace(/\t/g," ");
    compressed = original.replace(/\s+/g," ");
    return {
        // different ways of reading the file
        original: original,
        // as one line without spaces
        compressed: compressed,
        // as an array
        lines: original.replace(/[\r]/g, "").split("\n")
    };
}

function process(task, result) {
    // returns a string or an array
    result = task.process(result.original, result.compressed, result.lines);
    if (_.isUndefined(result)) {
        throw new Error('Task failed to return result.');
    }
    return _.isArray(result) ? result.join("\n") : result;
}

// collect files names into an array
glob('./src/**/!(*.spec).js', function (er, files) {

    _.each(tasks, function (task) {
        console.log('');
        console.log('Performing task: ' + task.name);

        _.isFunction(task.firstPass) && task.firstPass();

        _.each(files, function (file) {
            var result = read(file);
            if (!task.filterFile || task.filterFile(result.original, result.compressed, result.lines)) {
                //console.log(file);
                result = process(task, result);
                fs.writeFileSync(file, result, 'utf8');
            }
        });

        if (task.secondPass) {
            _.isFunction(task.secondPass) && task.secondPass();
            _.each(files, function (file) {
                var result = read(file);
                if (!task.filterFile || task.filterFile(result.original, result.compressed, result.lines)) {
                    //console.log(file);
                    result = process(task, result);
                    fs.writeFileSync(file, result, 'utf8');
                }
            });
        }
    });

    _.each(tasks, function (task) {
        if (_.isFunction(task.report)) {
            console.log('');
            console.log('Report task: ' + task.name);
            task.report();
        }
    });

});
