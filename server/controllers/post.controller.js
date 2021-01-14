const router = require('express').Router();
const postModel = require('../model/post.model');
const auth = require('../service/auth.interceptor');

router.get("/",
    (req, res) => {
        let getQuery = postModel.find();
        if (req.query.justCount != undefined) {
            getQuery = getQuery.countDocuments();
        } else if (req.query.page && req.query.pageSize) {
            if (req.query.page < 1) {
                return res.status(200).send([]);
            }
            getQuery = getQuery
                .skip((req.query.page - 1) * req.query.pageSize)
                .limit(+req.query.pageSize);
        }
        getQuery.then((results) => {
            let response = results;
            if (Array.isArray(response)) {
                response = response.map((postDoc) => {
                    return {
                        _id: postDoc._id,
                        title: postDoc.title,
                        content: postDoc.content,
                        createdBy: postDoc.createdBy
                    }
                })
            }
            res.status(200).json(response);
        }).catch((error) => {
            res.status(500).json({ message: "Error Fetching posts", error });
            console.log("Error fetching posts: ", error);
        });
    });

router.post("/", auth, (req, res) => {

    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content,
        createdBy: req.userProfile._id
    });

    newPost.save().then((result) => {
        res.status(201).json({ success: true, message: `Post Saved Successfully!`, post: newPost });
    }).catch((err) => {
        res.status(500).json({ success: false, message: `Save Failed!`, error: err });
    });

});

router.delete("/:id", auth, (req, res) => {

    const _id = req.params['id'];

    if (_id === 'all') {
        postModel.deleteMany({}).then((result) => {
            return res.status(200).send({ success: true, message: `Deleted All Posts!!` });
        }).catch((error) => {
            return res.status(500).json({ success: false, message: `Could not delete all posts` });
        });
        return;
    }

    postModel.findOne({ _id }).then((post) => {

        if (!post) {
            res.status(404).json({ success: false, message: `Post with id ${_id} NOT FOUND!` });
        } else if (post.createdBy != req.userProfile._id) {
            res.status(401).json({ success: false, message: `Only creator is authorized to delete the post.` });
        } else {
            postModel.deleteOne({ _id }).then((result) => {
                console.log("Delete Executed, result: ", result);
                if (result.n == 0) {
                    res.status(404).json({ success: false, message: `Post with id ${_id} NOT FOUND!` });
                } else if (result.deletedCount >= 1) {
                    res.status(200).send({ success: true, message: `Post with id ${_id} DELETED!` });
                } else {
                    res.status(200).send({ success: false, message: `Post with id ${_id} could NOT be deleted!` });
                }
            }).catch((error) => {
                console.log("Error on delete: ", error);
                res.status(500).json({ message: 'Error Occured', error });
            });
        }
    }).catch((error) => {
        console.log("Error on delete: ", error);
        res.status(500).json({ message: 'Error Occured', error });
    });
});

router.put('/:id', auth, (req, res) => {
    const _id = req.params['id'];

    postModel.findOne({ _id }).then((post) => {

        if (!post) {
            res.status(404).json({ success: false, message: `Post with id ${_id} NOT FOUND!` });
        } else if (post.createdBy != req.userProfile._id) {
            res.status(401).json({ success: false, message: `Only creator is authorized to edit the post.` });
        } else {

            postModel.updateOne({ _id }, { title: req.body.title, content: req.body.content }).then((result) => {
                console.log("Update Executed, result: ", result);
                if (result.nModified >= 1) {
                    postModel.findById(_id).then(doc => {
                        res.status(200).json(
                            { success: true, message: `Post with id ${_id} Updated!`, post: doc });
                    }).catch(err => {
                        res.status(200).json(
                            { success: false, message: `Error Occured!`, error: err });
                    });
                } else if (result.n == 0) {
                    res.status(404).json(
                        { success: false, message: `Post with id ${_id} NOT FOUND!` });
                } else if (result.nModified == 0) {
                    res.status(200).json(
                        { success: true, message: `Post with id ${_id} is already Up to Date!` });
                } else {
                    res.status(200).json({ success: false, message: `Post with id ${_id} could NOT be Updated!` });
                }
            }).catch((err) => {
                console.log("Error on update: ", err);
                res.status(500).json({ success: false, message: `Error Occured!`, error: err });
            });
        }
    }).catch((err) => {
        console.log("Error on update: ", err);
        res.status(500).json({ success: false, message: `Error Occured!`, error: err });
    });
});

module.exports = router;