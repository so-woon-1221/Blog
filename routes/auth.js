const express = require('express');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    // localStrategy에서 설정한 오류들 처리 (비밀번호 틀림, 가입안되어있음)
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    // req.login은 passport.serializeUser를 호출
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
      // return res.send(user);
    });
  })(req, res, next); // 미들웨어내의 미들웨어는 붙여줘야함;
  // const user = await User.find({ name: req.body.name });
  // res.send(user);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
