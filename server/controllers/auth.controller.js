const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');

const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN_SEC;
router.get('/users', (req, res, nest) => {
    userModel.find().then((userDocs) => {

        res.status(200).json(userDocs);
    }).catch((error) => {
        res.status(500).json({ message: "Could Not Process Request!", error });
    });
});

/* router.delete("/users/all", (req, res) => {

    userModel.deleteMany({}).then((result) => {
        res.status(200).send({ success: true, message: `Deleted All User Accounts!!` });
    }).catch((error) => {
        res.status(500).json({ success: false, message: `Could not delete User Accounts!` });
    });
}); */

router.post('/signup', (req, res, next) => {

    if (!req.body.email) {
        return res.status(400).json({ success: false, message: 'Invalid signup request, signup email missing!' });
    }
    if (!req.body.name) {
        return res.status(400).json({ success: false, message: 'Invalid signup request, User Name missing!' });
    }
    if (!req.body.password) {
        return res.status(400).json({ success: false, message: 'Invalid signup request, signup password missing!' });
    }
    bcrypt.hash(req.body.password, 10).then((passwordHash) => {
        console.log(passwordHash);
        const userProfile = new userModel({ email: req.body.email, password: passwordHash, name: req.body.name });
        userProfile.save().then((saveResponse) => {
            res.status(200).json({ success: true, message: 'Signup Successful!', 'profile': { email: userProfile.email, name: userProfile.name } });
        }, (error) => {
            let message = 'Could not sign up.';
            if (error.errors && error.errors.email && error.errors.email.kind === 'unique') {
                message = "Entered Email is already registered! Please login instead."
            }
            res.status(400).json({ success: false, message, error: error });
        });
    }).catch((error) => {
        res.status(400).json({ success: false, message: 'Could not sign up', error: error });
    });

});

router.post('/login', (req, res, next) => {

    if (!req.body.email) {
        return res.status(400).json({ success: false, message: 'Invalid login request, signup email missing!' });
    }
    if (!req.body.password) {
        return res.status(400).json({ success: false, message: 'Invalid login request, signup password missing!' });
    }
    userModel.findOne({ email: req.body.email }).then((userDoc) => {

        if (!userDoc) {
            return res.status(400).json({ success: false, message: "Email is not registered!" });
        }

        bcrypt.compare(req.body.password, userDoc.password).then((passwordMatches) => {
            if (passwordMatches) {
                let token = jwt.sign({ _id: userDoc._id, name: userDoc.name, email: userDoc.email }, process.env.JWT_SECRET,
                    { expiresIn: TOKEN_EXPIRES_IN }
                );
                res.status(200).json({
                    success: true,
                    message: 'Login Successful!',
                    token,
                    tokenExpiresInSec: TOKEN_EXPIRES_IN,
                    profile: {
                        name: userDoc.name,
                        email: userDoc.email,
                    }
                });

            } else {
                res.status(400).json({ success: false, message: "Incorrect Password!" });
            }
        }).catch((error) => {
            res.status(400).json({ success: false, message: error });
        });


    }).catch((error) => {
        res.status(400).json({ success: false, message: error });
    });
});

module.exports = router;