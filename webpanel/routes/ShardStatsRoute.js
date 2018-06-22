const express = require('express');
const router = express.Router();

router.post('/:shardId/status', (req, res) => {
    if(!req.body.token)
        return res.sendStatus(400);
    if(req.body.token !== process.config.webpanel.token)
        return res.sendStatus(401);

    let shard = {
        id: req.params.shardId,
        status: req.body.status
    };

    process.shards.set(req.params.shardId, shard);

    //Execute socket.io
    if(process.io) {
        process.io.emit('shardStatusUpdate', shard);
    }
    res.sendStatus(200);
});

router.post('/:shardId/users', (req, res) => {

});

router.post('/:shardId/guilds', (req, res) => {

});

module.exports = router;