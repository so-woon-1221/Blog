const express = require('express');
const Post = require('../schemas/post');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('editor');
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('editor', { post });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
