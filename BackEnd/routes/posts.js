const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// GET ALL DATA ON TABLE POST
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        const dataPost = { data: posts }
        res.json(dataPost);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// SUBMMIT NEW DATA ON TABLE POST
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const savedPost = await post.save();
        res.send({
            message: 'DATA HAS BEEN SAVED',
            body: savedPost,
        })
        next();
    } catch (err) {
        res.json({ message: err });
    }
});

// SPECIFIC POST
router.get('/:postId', async (req, res) => {
    try {
        const findById = await Post.findById(req.params.postId);
        res.json(findById);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// DELETE POST
router.delete('/:postId', async (req, res) => {
    try {
        const removeById = await Post.remove({ _id: req.params.postId });
        res.json(removeById);
    } catch (err) {
        res.json({ message: err.message });
    }
});

//UPDATE POST
router.patch('/:postId', async (req, res) => {
    try {
        const updatePostById = await Post.updateOne(
            { _id: req.params.postId },
            { $set: { title: req.body.title } }
        );
        res.json(updatePostById);
    } catch (err) {
        res.json({ message: err.message });
    }
})

module.exports = router;