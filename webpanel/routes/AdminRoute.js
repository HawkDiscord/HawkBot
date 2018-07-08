const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin', {
        page: {
            title: 'Hawk',
            subtitle: 'Admin'
        },
        sharder: process.sharder,
        shards: process.shards
    });
});

module.exports = router;