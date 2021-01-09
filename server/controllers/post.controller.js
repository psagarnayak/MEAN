const router = require('express').Router();
const postModel = require('../model/post.model');

router.get("/", (req, res) => {

    postModel.find({}).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        console.log("Error fetching posts: ", error);
    });
});

router.post("/", (req, res) => {

    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content
    });

    newPost.save().then((result) => {
        res.status(201).json(newPost);
    }).catch((err) => {
        res.status(500).json(err);
    });

});

router.delete("/:id", (req, res) => {

    const id = req.params['id'];

    postModel.deleteOne({ '_id': id }).then((result) => {
        console.log("Delete Executed, result: ", result);
        if (result.n == 0) {
            res.status(404).json({ message: `Post with id ${id} NOT FOUND!` });
        } else if (result.deletedCount >= 1) {
            res.status(200).send({ message: `Post with id ${id} DELETED!` });
        } else {
            res.status(200).send({ message: `Post with id ${id} could NOT be deleted!` });
        }
    }).catch((err) => {
        console.log("Error on delete: ", err);
        res.status(500).json({ message: 'Error Occured', err });
    });
});

router.put('/:id', (req, res) => {
    const id = req.params['id'];
    postModel.updateOne({ '_id': id }, { title: req.body.title, content: req.body.content }).then((result) => {
        console.log("Update Executed, result: ", result);
        if (result.n == 0) {
            res.status(404).json({ message: `Post with id ${id} NOT FOUND!` });
        } else if (result.nModified >= 1) {
            postModel.findById(id).then(doc => {
                res.status(200).send({ message: `Post with id ${id} Updated!`, newVersion: doc });
            }).catch(err => {

                res.status(200).send({ message: `Post with id ${id} Updated!` });
            });
        } else {
            res.status(200).send({ message: `Post with id ${id} could NOT be Updated!` });
        }
    }).catch((err) => {
        console.log("Error on update: ", err);
        res.status(500).json({ message: 'Error Occured', err });
    });
});

module.exports = router;