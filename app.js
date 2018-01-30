var express       = require('express'),
  app             = express(),
  bodyParser      = require('body-parser'),
  mongoose        = require('mongoose'),
  passport        = require('passport'),
  LocalStrategy   = require('passport-local'),
  methodOverride  = require('method-override'),
  Campground      = require('./models/campground'),
  Comment         = require('./models/comment'),
  User            = require('./models/user'),
  seedDB          = require('./seeds');

// Requiring routes
var campgroundsRoutes = require('./routes/campgrounds'),
    commentRoutes     = require('./routes/comments'),
    indexRoutes       = require('./routes/index');

mongoose.connect('mongodb://localhost/yelp_camp', function (err) {
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
app.set('view engine', 'ejs');
app.disable('x-powered-by');

// seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'H59TG5xkicoQRr4gv9BijYz26KOKFViv7iio4OAZMlc15PHtuFj7reeYyXtVMvS8',
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
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});