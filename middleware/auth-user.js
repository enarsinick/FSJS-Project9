
const auth = require('basic-auth');
const { User } = require('../models/');
const bcrypt = require('bcrypt');

// Middleware to authenticate the request using Basic Auth.
module.exports.authenticateUser = async (req, res, next) => {
    // Stores any messages
    let message;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If credentials are availabel the do this
    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name}});

        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            if (authenticated) {
                console.log(`Authentication successful`);
                req.currentUser = user;
            } else {
                message = `Authentication failure`;
            }
        } else {
            message = `User not found`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({message: "Access Denied"});
    } else {
        next();   
    }
};