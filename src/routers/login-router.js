const express = require('express');
const User = require('../db/models/user-model');
const router = new express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({user, token});
    } catch(e) {
        res.status(400).send();
    }
});

module.exports = router;