const { EventEmitter } = require('events');
const messageHandler = require('./SharderMessages');

class BotSharder extends EventEmitter {
    constructor(worker) {
        super();
        this.worker = worker;
        this.assign();
        this.workerCrashes = {};
    }

    assign() {
        this.worker.on('online', () => {
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
        this.emit('started');
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
                this.emit('reboot', {code: code});
                const newWorker = cluster.fork();
                Object.assign(newWorker, {
                    type: "bot",
                    shardStart: this.worker.shardStart,
                    shardEnd: this.worker.shardEnd,
                    shardRange: this.worker.shardRange,
                    totalShards: this.worker.totalShards
                });
                module.exports = newWorker;
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