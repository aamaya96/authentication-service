const express = require('express');
const User = require('../db/models/user-model');
const router = new express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e)  {
        res.status(500).send();
    }
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(user) {
            await user.populate('roles').execPopulate();
            res.send(user);
        }else{
            res.status(404).send();
        }
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.patch('/users/:id', async (req, res) => {
    const allowedUpdates = ['firstName', 'email', 'lastName', 'password'];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid request, attempt to update unauthorized filds'});
    }

    try {
        const user = await User.findById(req.params.id);
        
        if(!user) {
            return res.status(404).send();
        }
        
        updates.forEach( update => user[update] = req.body[update]);
        await user.save();
        res.send(user);

    } catch(e) {
        res.status(400).send();
    }
    
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if(user) {
            res.send(user);
        }else {
            res.status(404).send();
        }
    } catch(e) {

    }
});

module.exports = router