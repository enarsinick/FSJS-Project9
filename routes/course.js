var express = require('express')
var router = express.Router()
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course } = require('../models');
const { User } = require('../models');

// Returns full list of courses and owner of each course
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                as: 'owner',
                attributes: ['firstName', 'lastName', 'emailAddress']
            },
        ],
    });
    res.status(200).json(courses.map(course => course.get({ plain: true }))).end();
}));

// Return course based on passed ID and owner of that course
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: User,
                as: 'owner',
                attributes: ['firstName', 'lastName', 'emailAddress']
            },
        ],
    });
    res.json(course).status(200).end();
}));

// Create a course
router.post('/courses', authenticateUser, asyncHandler(async (req, res, next) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(201).location(`/courses/${newCourse.id}`).end();
    } catch(error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            console.log(errors);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));


module.exports = router;