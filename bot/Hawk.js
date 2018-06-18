const Base = require('eris-sharder').Base;

class Hawk extends Base {
    constructor(bot) {
        super(bot);
    }

    launch() {
        console.log('Launched Bot');
    }
}

module.exports = Hawk;