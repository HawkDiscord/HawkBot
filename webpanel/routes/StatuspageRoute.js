const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('status', {
        page: {
            title: 'Hawk',
            subtitle: 'Status'
        },
        sharder: process.sharder,
        shards: process.shards
    });
});

module.exports = router;