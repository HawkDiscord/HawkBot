const express = require('express');
const router = express.Router();
const discordOauthUser = require('../entities/DiscordOauth.js');

router.get('/', async (req, res) => {
    if (!req.cookies.hawkToken)
        return res.redirect(process.config.webpanel.baseurl + '/login');
    let user = await discordOauthUser.fetchUser(req.cookies.hawkToken);
    if (!user)
        return res.redirect(process.config.webpanel.baseurl + '/login');
    res.send(user);
});

module.exports = router;