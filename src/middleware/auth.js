const jwt = require('jsonwebtoken');
const User = require('../db/models/user-model');

const auth = async (req, res, next) => {
    const authEndpoints = {
        users: "ADMIN",
        roles: "ADMIN"
    };

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'hello-world');
        const user = await User.findById(decode._id);
        const role = decode.role;

        if(!user) {
            throw new Error();
        }

        const pathRegex = /\/(\w+)(\/.*)*/g;
        const matchedPath = pathRegex.exec(req.path);

        if(matchedPath && matchedPath.length > 1 && matchedPath[1]) {
            const basePath = matchedPath[1];
            if (authEndpoints[basePath] && authEndpoints[basePath] !== role) {
                return res.status(403).send();
            }
        } else {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        req.role = role;
        next();
    } catch(e) {
        return res.status(401).send({ error: 'Please provide a valid authentication'});
    }
}

module.exports = auth;