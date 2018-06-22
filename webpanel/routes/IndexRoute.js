const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        page: {
            title: 'Hawk',
            subtitle: 'Home'
        },
        sharder: process.sharder,
        shards: process.shards
    });
});

module.exports = router;