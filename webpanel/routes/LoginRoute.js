const express = require('express');
const btoa = require('btoa');
const superagent = require('superagent');
const discordOauth = require('../entities/DiscordOauth.js');
const webhook = require('../../util/webhook.js');
const router = express.Router();

router.get('/', (req, res) => {
    let redirect = encodeURIComponent(`${process.config.webpanel.baseurl}/login/callback`);
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${process.config.bot.id}&redirect_uri=${redirect}&response_type=code&scope=identify%20guilds`);
});

router.get('/callback', async (req, res) => {
    if(!req.query.code)
        return res.redirect(process.config.webpanel.baseurl);
    let code = req.query.code;
    let credentials = btoa(`${process.config.bot.id}:${process.config.bot.secret}`);
    let response = await superagent.post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(process.config.webpanel.baseurl)}/login/callback`)
        .set('Authorization', `Basic ${credentials}`)
        .send();
    let loginData = response.body;
    res.cookie('hawkToken', loginData.access_token);
    let user = await discordOauth.fetchUser(loginData.access_token);
    webhook.sendWebpanelLogin(user);
    res.redirect(`${process.config.webpanel.baseurl}/dashboard`);
});

module.exports = router;