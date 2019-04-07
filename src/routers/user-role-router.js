const express = require('express');
const User = require('../db/models/user-model');
const Role = require('../db/models/role-model');
const router = new express.Router();

router.post('/users/:userId/role/:roleId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        const role = await Role.findById(req.params.roleId);
        
        if(!user || !role){
            res.status(404).send();
        }

        user.roles.push(role._id);
        await user.save();

        console.log(req.params.userId, req.params.roleId);
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});

router.delete('/users/:userId/role/:roleId', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.userId,
            roles: [req.params.roleId]
        });

        if(user) {
            user.roles = user.roles.filter(role => role.toString() !== req.params.roleId);
            user.save();
            res.send(user);
        }else {
            res.status(404).send();
        }
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;