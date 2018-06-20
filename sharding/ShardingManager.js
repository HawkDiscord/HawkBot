const cpuCount = require('os').cpus().length;
const superagent = require('superagent');
const { EventEmitter } = require('events');
const BotSharder = require("./BotSharder");
const path = require('path');
let Main;
let Args;
let Token;

Object.defineProperty(cluster, "onlineWorkers", {
    get: () => Object.keys(cluster.workers)
        .map(id => cluster.workers[id])
        .filter(work => work.isConnected())
});

class ShardingManager extends EventEmitter {
    constructor(token, pathToMain, options) {
        super();
        this.token = token;
        this.pathToMain = pathToMain;
        this.shardsPerWorker;
        this.options = options;
        Args = options;
        Main = pathToMain;
        Token = token;
    }

    async requestShardCount() {
        let tokenRequest = await superagent.get("https://discordapp.com/api/gateway/bot").set("Authorization", this.token);
        this.totalShards = tokenRequest.body.shards;
    }

    async launch() {
        if(cluster.isMaster) {
            await this.requestShardCount();
            if(cpuCount >= this.totalShards)
                this.shardsPerWorker = 1;
            else
                this.shardsPerWorker = Math.ceil(this.totalShards / cpuCount);
            this.workerCount = Math.ceil(this.totalShards / this.shardsPerWorker);

            for(let i = 0; i < this.workerCount; i++) {
                let shardStart = i * this.shardsPerWorker;
                let shardEnd = ((i + 1) * this.shardsPerWorker) - 1;
                if(shardEnd > this.totalShards - 1)
                    shardEnd = this.totalShards - 1;
                let shardRange = shardStart === shardEnd ? `shard ${shardStart}` : `shards ${shardStart}-${shardEnd}`;
                const worker = cluster.fork();
                const lTotalShards = this.totalShards;
                Object.assign(worker, { type: "bot", shardStart, shardEnd, shardRange, lTotalShards });
                let botSharder = new BotSharder(worker);

                botSharder.on('started', () => {
                    this.emit('workerStarted', worker);
                });

                botSharder.on('reboot', code => {
                    this.emit('workerReboot');
                });

                botSharder.on('crashClose', code => {
                    this.emit('workerCrashClosed', code);
                });

                botSharder.on('killes', code => {
                    this.emit('workerKilled', code);
                });
            }
        }
    }    
}



if(!cluster.isMaster) {
    async function startupMessage(msg) {
        if(msg.type !== 'startup') {
            cluster.worker.once('message', startupMessage);
                return;
        }
        delete msg.type;
        delete msg.processType;
        Object.assign(cluster.worker, msg);
        new (require(Main))(Token, Args);
    }
    cluster.worker.once('message', startupMessage);
}

module.exports = ShardingManager;


