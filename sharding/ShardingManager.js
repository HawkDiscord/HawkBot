const cpuCount = require('os').cpus().length;
const superagent = require('superagent');
const { EventEmitter } = require('events');
const BotSharder = require("./BotSharder");
const path = require('path');
const colors = require('colors');
const timeout = require('async-timeout');
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
        let tokenRequest = await superagent.get('https://discordapp.com/api/gateway/bot').set('Authorization', this.token);
        this.lTotalShards = 18; //tokenRequest.body.shards;
    }

    async launch() {
        if(cluster.isMaster) {
            await this.requestShardCount();
            if(cpuCount >= this.lTotalShards)
                this.lShardsPerWorker = 1;
            else
                this.lShardsPerWorker = Math.ceil(this.lTotalShards / cpuCount);
            this.workerCount = Math.ceil(this.lTotalShards / this.lShardsPerWorker);

            console.log(`[ `.white + `ClusterManager`.green + ` ] **************`);
            console.log(`[ `.white + `ClusterManager`.green + ` ] * Shards: ${this.lTotalShards}`);
            console.log(`[ `.white + `ClusterManager`.green + ` ] * Workers: ${this.workerCount}`);
            console.log(`[ `.white + `ClusterManager`.green + ` ] * S/W: ${this.lShardsPerWorker}`);
            console.log(`[ `.white + `ClusterManager`.green + ` ] **************`);
            
            for(let i = 0; i < this.workerCount; i++) {
                await timeout(5000);
                let shardStart = i * this.lShardsPerWorker;
                let shardEnd = ((i + 1) * this.lShardsPerWorker) - 1;
                if(shardEnd > this.lTotalShards - 1)
                    shardEnd = this.lTotalShards - 1;
                const worker = cluster.fork();
                const totalShards = this.lTotalShards;
                const shardsPerWorker = this.lShardsPerWorker;
                Object.assign(worker, { type: 'bot', shardStart, shardEnd, totalShards, shardsPerWorker});

                let botSharder = new BotSharder(worker);
                botSharder.on('started', () => {
                    this.emit('workerStarted', worker);
                });

                botSharder.on('reboot', (code) => {
                    this.emit('workerReboot', worker);
                });

                botSharder.on('crashClose', code => {
                    this.emit('workerCrashClosed', code);
                });

                botSharder.on('killed', code => {
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