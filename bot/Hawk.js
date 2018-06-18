const Base = require('eris-sharder').Base;
const rethinkdb = require('../util/rethink.js');

class Hawk extends Base {
    constructor(bot) {
        super(bot);
        this.rethink = rethinkdb.connectToRethink();
    }

    launch() {
        console.log('Launched Bot');
    }
}

module.exports = Hawk;