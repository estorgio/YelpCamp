var express       = require('express'),
  app             = express(),
  bodyParser      = require('body-parser'),
  mongoose        = require('mongoose'),
  flash           = require('connect-flash'),
  passport        = require('passport'),
  LocalStrategy   = require('passport-local'),
  methodOverride  = require('method-override'),
  Campground      = require('./models/campground'),
  Comment         = require('./models/comment'),
  User            = require('./models/user'),
  seedDB          = require('./seeds'),
  fs              = require('fs');

// Requiring routes
var campgroundsRoutes = require('./routes/campgrounds'),
    commentRoutes     = require('./routes/comments'),
    indexRoutes       = require('./routes/index');

// Load App Config
var APP_CONFIG;
if(!fs.existsSync('./config.js')) {
  console.log('CONFIG.JS not found, please make a configuration file first.');
  process.exit(1);
} else {
  APP_CONFIG = require('./config');
}

mongoose.connect(APP_CONFIG.DATABASE_URI, function (err) {
  if (err) {
    console.log('An error occurred while connecting to the database.');
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
app.disable('x-powered-by');

// seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: APP_CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.APP_CONFIG = APP_CONFIG;
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(APP_CONFIG.APP_PORT, function () {
  console.log('App has started on port ' + APP_CONFIG.APP_PORT + '.');
});