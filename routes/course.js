var express = require('express')
var router = express.Router()
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course } = require('../models');
const { User } = require('../models');

// Returns full list of courses and owner of each course
router.get('/courses', asyncHandler(async(req, res) => {
    // Fubd all courses in DB
    const courses = await Course.findAll({
        // Remove timestamps from data 
        // and include the user that owns the course
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
    // Find a specific course in DB
    // and exclude and include certain data
    const course = await Course.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
        // Create a new course based on content in request body
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

// Update a course if the user is authenticated
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const user = req.currentUser;
        const course = await Course.findByPk(req.params.id);
        const errors = [];

        if (user.id === course.userId) {
            // If there is no course title
            if (!req.body.title) {
                errors.push('Please provide a value for "title"');
            }

            // If there is no course description
            if (!req.body.description) {
                errors.push('Please provide a value for "description"');
            }

            // If there are any errors
            if (errors.length > 0) {
                res.status(400).json({ errors });
            } else {
                await course.update(req.body);
                res.status(204).end();
            };
        } else {
            res.status(403).json({ message: "You cannot edit a course that doesn't belong to you"});
        };
        
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

// Delete a course if the user is authenticated
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const user = req.currentUser;
        const course = await Course.findByPk(req.params.id);

        if (user.id === course.userId) {
            // Find the course by ID and then destroy/delete it from DB
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json({ message: "You cannot delete a course that doesn't belong to you"});
        }
        
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