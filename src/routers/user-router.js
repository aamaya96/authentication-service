const express = require('express');
const User = require('../db/models/user-model');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e)  {
        res.status(500).send();
    }
});

router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(user) {
            await user.populate('roles').execPopulate();
            await user.populate('management.createdBy').execPopulate();
            await user.populate('management.updatedBy').execPopulate();
            res.send(user);
        }else{
            res.status(404).send();
        }
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users', auth, async (req, res) => {

    const management = {
        created: new Date().getTime(),
        createdBy: req.user._id,
        updated: new Date().getTime(),
        updatedBy: req.user._id
    };
    const user = new User({
        ...req.body,
        management
    });

    try {
        await user.populate('role').execPopulate();
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.patch('/users/:id', auth, async (req, res) => {
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
        user.management.updated = new Date().getTime();
        user.management.updatedBy = req.user._id;
        await user.save();
        res.send(user);

    } catch(e) {
        res.status(400).send();
    }
    
});

router.delete('/users/:id', auth, async (req, res) => {
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