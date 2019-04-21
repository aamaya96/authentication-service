const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/me', auth, async (req, res) => {
    const allowedUpdates = ['firstName', 'email', 'lastName', 'password'];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid request, attempt to update unauthorized filds'});
    }

    try {
        updates.forEach( update => req.user[update] = req.body[update]);
        req.user.management.updated = new Date().getTime();
        req.user.management.updatedBy = req.user._id;
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(400).send();
    }
});

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports =  router;