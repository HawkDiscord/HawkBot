const { EventEmitter } = require('events');
const messageHandler = require('./SharderMessages');

class BotSharder extends EventEmitter {
    constructor(worker) {
        super();
        this.worker = worker;
        this.workerCrashes = {};
        this.assign();
    }

    assign() {
        this.worker.on('online', () => {
            this.emit('started');
            this.worker.send({
                type: 'startup',
                shardRange: this.worker.shardRange,
                shardStart: this.worker.shardStart,
                shardEnd: this.worker.shardEnd,
                totalShards: this.worker.totalShards,
                processType: 'bot'
            });
        });
        this.assignShutdownListener();
        this.assignMessageListener();
        this.assignBotListener();
    }

    assignBotListener() {
       
    }

    assignMessageListener() {
        this.worker.on("message", msg => messageHandler(msg, this.worker));
    }

    assignShutdownListener() {
        this.worker.on("exit", (code, signal) => {
            if(signal)
                return;
            else if(code === 0) 
                this.emit('killed', {code: code});
            else if(this.workerCrashes[this.worker.shardRange] >= 5)
                this.emit('crashClose', {code: code});
            else {
                const newWorker = cluster.fork();
                Object.assign(newWorker, {
                    type: "bot",
                    shardStart: this.worker.shardStart,
                    shardEnd: this.worker.shardEnd,
                    shardRange: this.worker.shardRange,
                    totalShards: this.worker.totalShards
                });
                this.emit('reboot', {code: code, newWorker: newWorker});
                new BotSharder(newWorker);
                if(!this.workerCrashes[this.worker.shardRange])
                    this.workerCrashes[this.worker.shardRange] = 1;
                else
                    this.workerCrashes[this.worker.shardRange]++;
                setTimeout(() => {
                    if(this.workerCrashes[this.worker.shardRange] === 1)
                        delete this.workerCrashes[this.worker.shardRange];
                    else
                        this.workerCrashes[this.worker.shardRange]--;
                }, 120000);
            }
        });
    }
}

module.exports = BotSharder;