const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');

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
        return res.status(400).json({ error: 'Invalid signup request, signup email missing!' });
    }
    if (!req.body.name) {
        return res.status(400).json({ error: 'Invalid signup request, User Name missing!' });
    }
    if (!req.body.password) {
        return res.status(400).json({ error: 'Invalid signup request, signup password missing!' });
    }
    bcrypt.hash(req.body.password, 10).then((passwordHash) => {
        console.log(passwordHash);
        const userProfile = new userModel({ email: req.body.email, password: passwordHash, name: req.body.name });
        userProfile.save().then((saveResponse) => {
            res.status(200).json({ success: true, message: 'Signup Successful!', 'userProfile': { email: userProfile.email, name: userProfile.name } });
        }, (error) => {
            res.status(400).json({ message: 'Could not sign up', error: error });
        });
    }).catch((error) => {
        res.status(400).json({ message: 'Could not sign up', error: error });
    });

});

router.post('/login', (req, res, next) => {

    if (!req.body.email) {
        return res.status(400).json({ error: 'Invalid login request, signup email missing!' });
    }
    if (!req.body.password) {
        return res.status(400).json({ error: 'Invalid login request, signup password missing!' });
    }
    userModel.findOne({ email: req.body.email }).then((userDoc) => {

        bcrypt.compare(req.body.password, userDoc.password).then((paswordMatches) => {

            if (paswordMatches) {

                let token = jwt.sign({ _id: userDoc._id, name: userDoc.name, email: userDoc.email }, process.env.JWT_SECRET,
                    { expiresIn: 60 }
                );
                res.status(200).json({ success: true, message: 'Login Successful!', token });

            } else {
                res.status(400).json({ message: 'Could not login', error: "Pasword does not match!" });
            }
        }).catch((error) => {
            res.status(400).json({ message: 'Could not login', error: error });
        });


    }).catch((error) => {
        res.status(400).json({ message: 'Could not login', error: error });
    });
});

module.exports = router;