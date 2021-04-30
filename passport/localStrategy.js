const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../schemas/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    // req.body의 값을 넣어주면 됨
    usernameField: 'name',
    passwordField: 'password',
  }, async (name, password, done) => {
    try {
      const exUser = await User.findOne({ name });
      if (exUser) {
        // const result = await bcrypt.compare(password, exUser.password);
        const result = (password === exUser.password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '관리자가 아닙니다.' });
      }
    } catch (e) {
      console.error(e);
      done(e);
    }
  }));
};
