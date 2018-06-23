const Eris = require("eris-additions")(require("eris"));
const rethinkdb = require('../util/rethink');
const fs = require('fs');
const colors = require('colors');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));

class Hawk extends Eris.Client {
    constructor(token, options = {}) {
        options = {
            options,
            firstShardID: cluster.worker.shardStart,
            lastShardID: cluster.worker.shardEnd,
            maxShards: cluster.worker.totalShards
        }

        super(token, options);
        this.worker = cluster.worker;
        this.shard = {
            id: this.worker.shardStart
        }
        this.load(true);
        global.bot = this;
    }

    async load(doLaunch=false) {
        this.info(`Core`, `Successfully launched client with shards from ${this.worker.shardStart} to ${this.worker.shardEnd}!`);
        this.functions = require('../util/functions');
        this.update(3);
        this.rethink = await rethinkdb.connectToRethink();
        await rethinkdb.createDefaults(this.rethink);
        this.servers = new Eris.Collection();
        this.members = new Eris.Collection();
        this.config = config;
        this.update(4);
        this.loadingManager = new (require('./core/LoadingManager'))(this);
        this.loadingManager.loadAll();
        if(doLaunch) {
            this.update(2);
            this.launch();
        }
    }

    update(status) {
        var shards = [];

        for (let i = this.options.firstShardID; i < (this.options.lastShardID + 1); i++) {
            shards.push(i);
        }

        shards.forEach(shard => {
            this.functions.updateShardStatus(shard, status);
        });
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
        console.log(`[ `.white + `W - ${this.worker.id} | S - ${(this.worker.shardStart.toString().length == 1 ? "0" + this.worker.shardStart.toString() : this.worker.shardStart)} ] `.white + `[`.white + ` ${type} `.green + `] `.white + `[`.white + ` ${title} `.cyan + `] `.white + `${message}`.white);
    }
    
    launch() {
        this.connect();

        this.on('ready', () => {
            this.emit('launchNext');            
        });
    }
}

cluster.worker.on("message", async msg => {
    if(msg.type === "eval") {
        try {
            let result = (await eval(msg.input));
            process.send({ type: "output", result, id: msg.id });
        } catch(err) {
            process.send({ type: "output", error: err.stack, id: msg.id });
        }
    } else if(msg.type === "output") {
            cluster.worker.emit("outputMessage", msg);
    }
}); 

module.exports = Hawk;