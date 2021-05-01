const express = require('express');
const fs = require('fs');
const Post = require('../schemas/post');
const { getBackgroundImage } = require('../controller/backgroundContorller');

const router = express.Router();

const paging = (page, totalPost) => {
  const maxPost = 2;
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

router.get('/:category', async (req, res, next) => {
  const { page } = req.query;
  const image = `/image/${getBackgroundImage()}`;
  try {
    const totalPost = await Post.countDocuments({ category: req.params.category }); // (2)
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
    const posts = await Post.find({ category: req.params.category }) // (5)
      .sort({ createdAt: -1 })
      .skip(hidePost)
      .limit(maxPost);
    console.log(posts);
    res.render('category', { // (6)
      posts,
      currentPage,
      startPage,
      endPage,
      totalPage,
      category: req.params.category,
      image,
      title: req.params.category,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const image = `/image/${getBackgroundImage()}`;
    const categories = await Post.find({}, { _id: 0, category: 1 });
    const results = [];
    const temps = [];
    for (const category of categories) {
      for (let i = 0; i < category.category.length; i++) {
        if (category.category[i].length > 1) {
          if (!temps.includes(category.category[i])) {
            temps.push(category.category[i]);
            results.push({ name: category.category[i], count: 1 });
          } else {
            const index = temps.indexOf(category.category[i]);
            results[index].count += 1;
          }
        }
      }
    }
    results.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    // res.send(results);
    res.render('category', { results, image, title: 'Category' });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
