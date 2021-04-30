const passport = require('passport');
const local = require('./localStrategy');
const User = require('../schemas/user');

module.exports = () => {
  //  로그인시 실행되면 req.session에 어떤 데이터를 저장할지 정함
  //  매견변수로 user를 받고 두번째 인수로 user.id넘김
  passport.serializeUser((user, done) => {
    done(null, user.name);
  });

  // 매 요청시 실행됨
  //  passport.session 미들웨어가 이 메서드 호출
  //  serializeUser의 두번째 인수가 deserializeUser의 파라미터
  //  조회한 user정보를 req.user에 저장
  //  세션에 저장한 아이디를 통해 사용자정보객체를 매번 불러오는 것임
  passport.deserializeUser((name, done) => {
    User.findOne({ name })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};
