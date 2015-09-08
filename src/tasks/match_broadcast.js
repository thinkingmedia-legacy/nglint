var logger = require('winston');
var _ = require('lodash');

/**
 * Ensures that all $broadcast calls have a listening $on handler.
 */
module.exports = {
    name: 'Match Broadcast',
    broadcasts: [],
    counters: {},
    pass: 'first',
    secondPass: function () {
        this.pass = 'second';
    },
    first: function (original, compressed, lines) {
        var casts = _.filter(lines, function (line) {
            return !_.startsWith(line, '//') && line.indexOf('$broadcast') !== -1;
        });
        _.each(casts, function (cast) {
            cast = cast.replace(/['"]/g, '"');
            var m = cast.match(/\$broadcast\s*\(\s*"([^"]+)/);
            if (m) {
                this.broadcasts.push(m[1].trim());
            }
        }.bind(this));
        this.broadcasts = _.uniq(this.broadcasts);
    },
    second: function (original, compressed, lines) {
        var self = this;
        _.each(lines, function (line) {
            line = line.replace(/['"]/g, '"');
            _.each(self.broadcasts, function (broadcast) {
                if (line.indexOf('"' + broadcast + '"') !== -1) {
                    self.counters[broadcast] = ~~self.counters[broadcast] + 1;
                }
            });
        });
    },
    process: function (original, compress, lines) {
        return this.pass == 'first'
            ? this.first(original, compress, lines)
            : this.second(original, compress, lines);
    },
    report: function () {
        _.each(this.broadcasts, function (broadcast) {
            var c = ~~this.counters[broadcast];
            logger.info('Broadcast: ' + broadcast + ' Listeners: ' + c);
        }.bind(this));
    }
};