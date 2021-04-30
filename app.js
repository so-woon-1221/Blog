const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const connect = require('./schemas');

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
const passportConfig = require('./passport');

const mainRouter = require('./routes/mainRouter');
const postRouter = require('./routes/post');
const editorRouter = require('./routes/editor');
const projectRouter = require('./routes/project');
const categoryRouter = require('./routes/category');
const authRouter = require('./routes/auth');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'njk');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({ client: redisClient }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', mainRouter);
app.use('/post', postRouter);
app.use('/editor', editorRouter);
app.use('/project', projectRouter);
app.use('/category', categoryRouter);
app.use('/auth', authRouter);

connect();

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 대기중');
});
