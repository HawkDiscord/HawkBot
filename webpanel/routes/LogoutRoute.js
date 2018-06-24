const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.clearCookie('hawkToken');
    res.redirect(process.config.webpanel.baseurl);
});

module.exports = router;