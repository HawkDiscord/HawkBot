const Eris = require('eris');
const rethinkdb = require('../util/rethink');
const fancyLog = require('fancy-log');

class Hawk extends Eris.Client {
    constructor(token, options = {}) {
        options = {
            options,
            firstShardID: cluster.worker.shardStart,
            lastShardID: cluster.worker.shardEnd,
            maxShards: cluster.worker.totalShards}
        super(token, options);

        this.worker = cluster.worker;
        this.rethink = rethinkdb.connectToRethink();
        this.commands = {};
        this.modules = {};
        this.commandManager = new (require('./command/CommandManager'))(this);
        this.launch();
    }

    info(title, message) {
        this.log('INFO', title, message);
    }

    debug(title, message) {
        this.log('DEBUG', title, message);
    }

    error(title, message) {
        this.log('ERROR', title, message);
    }

    warn(title, message) {
        this.log('WARN', title, message);
    }

    log(type, title, message) {
        fancyLog(`[W:${this.worker.id}/S:${this.worker.shardStart}] [${type}] [${title}] ${message}`);
    }

    launch() {
        this.commandManager.loadCommands();
        this.connect();
    }
}
module.exports = Hawk;