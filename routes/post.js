const express = require('express');
const Post = require('../schemas/post');
const { getBackgroundImage } = require('../controller/backgroundContorller');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      thumbnail: req.body.thumbnail,
      category: req.body.category,
    });
    console.log(post);
    res.send({ message: '등록되었습니다.' });
    // res.redirect('/');
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const image = `/image/${getBackgroundImage()}`;
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    res.render('post', { post, image });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findOneAndRemove({ _id: req.params.id });
    // const posts = await Post.find({}).sort({ createdAt: -1 });
    // console.log(post)
    res.send({ message: '삭제되었습니다.' });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id },
      {
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        category: req.body.category,
      });
    res.send({ message: '수정되었습니다.' });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
