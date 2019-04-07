const express = require('express');
const Role = require('../db/models/role-model');
const router = new express.Router();

router.get('/roles', async (req, res) => {
    try{
        const roles = await Role.find({});
        res.send(roles);
    } catch(e) {
        res.status(500).send();
    }
});

router.get('/roles/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const role = Role.findById(_id);

        if(role) {
            res.send(role);
        } else {
            res.status(404).send();
        }
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/roles', async (req, res) => {
    const role = new Role(req.body);

    try {
        await role.save();
        res.status(201).send(role);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.patch('/roles/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid request, attempt to update unauthorized filds'});
    }

    try {
        const role = await Role.findById(req.params.id);
        
        if(!role) {
            return res.status(404).send();
        }
        
        updates.forEach( update => role[update] = req.body[update]);
        await role.save();
        res.send(role);

    } catch(e) {
        res.status(400).send();
    }
});

router.delete('/roles/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);

        if (!role) {
            return res.status(404).send();
        }

        res.send(role);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;