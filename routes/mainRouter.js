const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../schemas/post');
const { getBackgroundImage } = require('../controller/backgroundContorller');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/image/');
    },
    filename(req, file, cb) {
      cb(null, 'background');
    },
  }),
});

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/about', (req, res, next) => {
  const image = `/image/${getBackgroundImage()}`;
  res.render('about', { image, title: 'About' });
});

router.post('/background', upload.single('img'), (req, res) => {
  console.log(req.file);
  res.send(req.file.filename);
  // res.json({ url: `/img/${req.file.filname}` });
});

const paging = (page, totalPost) => {
  const maxPost = 10;
  let currentPage = page ? parseInt(page) : 1;
  const hidePost = page === 1 ? 0 : (page - 1) * maxPost;
  const totalPage = Math.ceil(totalPost / maxPost);

  if (currentPage > totalPage) {
    currentPage = totalPage;
  }

  const startPage = 1;
  const endPage = totalPage;

  return {
    startPage, endPage, hidePost, maxPost, totalPage, currentPage,
  }; // (10)
};

router.get('/', async (req, res, next) => {
  const { page } = req.query;
  try {
    const image = `/image/${getBackgroundImage()}`;
    const totalPost = await Post.countDocuments({}); // (2)
    // if (!totalPost) { // (3)
    //   throw Error();
    // }
    const {
      startPage,
      endPage,
      hidePost,
      maxPost,
      totalPage,
      currentPage,
    } = paging(page, totalPost); // (4)
    const posts = await Post.find({}) // (5)
      .sort({ createdAt: -1 })
      .skip(hidePost)
      .limit(maxPost);
    res.render('index', { // (6)
      posts,
      currentPage,
      startPage,
      endPage,
      totalPage,
      image,
      title: 'Sowoon',
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
