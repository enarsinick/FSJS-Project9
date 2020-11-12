var express = require('express')
var router = express.Router()
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { User } = require('../models');

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201)
            .location('/')
            .json({ message: 'User has been created'})
            .end();
    } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
    }
}));

module.exports = router;