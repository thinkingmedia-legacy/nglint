require('./bootstrap.js');

var logger = require('winston');
var params = require('./params.js');
var glob = require('glob');
var fs = require('fs-extra');
var _ = require('lodash');
var lint = require('./lint');

if (params.version) {
    params.showVersion();
    return;
}

if (params.help || params.source === null) {
    params.usage();
    return;
}

try {
    params.validate();
}
catch ($ex) {
    console.error("fatal: " + $ex.message);
    return;
}

// what will be done, and in what order
var tasks = [
    //require('./tasks/match_broadcast'),
    //require('./tasks/inspect_rootscope'),
    require('./tasks/globals')
];

function callTaskMethod() {
    var args = Array.prototype.slice.call(arguments);
    var method = args.shift();
    _.each(tasks, function (task) {
        _.isFunction(task[method]) && task[method].apply(task, args);
    });
}

// collect files names into an array
glob(params.source + '/**/*+(.js|.html)', function (er, files) {

    _.each(['firstPass', 'secondPass'], function (pass) {
        lint.pass = pass;
        callTaskMethod('startPass', pass);
        _.each(files, function (file) {
            lint.read(file);
            _.each(tasks, function(task) {
                if(_.isFunction(task.filter) ? task.filter.call(task) : true) {
                    _.isFunction(task[pass]) && task[pass].call(task);
                }
            });
        });
        lint.clear();
        callTaskMethod('finishPass', pass);
    });

    callTaskMethod('report');
});