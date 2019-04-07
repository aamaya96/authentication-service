const jwt = require('jsonwebtoken');
const User = require('../db/models/user-model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'hello-world');
        const user = await User.findById(decode._id);
        const roles = decode.roles;
        await user.populate('roles').execPopulate();

        if(!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        req.roles = roles;
        next();
    } catch(e) {
        res.status(401).send({ error: 'Please provide a valid authentication'});
    }
}

module.exports = auth;