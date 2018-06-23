const { Collection } = require('eris');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const cookieParser = require('cookie-parser');
const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
const superagent = require('superagent');
const rethinkdb = require('rethinkdbdash');
const helmet = require('helmet');
const fancyLog = require('fancy-log');

let rethink = rethinkdb(config.rethinkdb);
process.config = config;
process.rethink = rethink;
process.shards = new Collection();

//Routes
const statuspageRoute = require('./routes/StatuspageRoute');
const apiShardStatsRoute = require('./routes/ShardStatsRoute');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// States: 0: Ready and Operational, 1: Having Issues,

app.use('/status', statuspageRoute);
app.use('/api/shards', apiShardStatsRoute);

class Webpanel {
    constructor(sharder) {
        this.sharder = sharder;
        process.sharder = sharder;
        this._startServer();
    }

    async _startServer() {
        let port = config.webpanel.port;
        server.listen(port, () => {
            this.info('Launcher', `Started Webpanel on port ${port}`);
            process.instance = this;
        });

        io.on('connection', async socket => {
            process.io = io;

            process.shards.forEach(shard => {
                socket.emit('shardStatusUpdate', shard);
            });
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
        console.log(`[ Webpanel ] [`.white + ` ${type} `.green + `] `.white + `[`.white + ` ${title} `.cyan + `] `.white + `${message}`.white);
    }
}

exports.Webpanel = Webpanel;