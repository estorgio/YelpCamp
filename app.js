var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp', function (err) {
  if (err) {
    console.log('An error occurred while connecting to the database.');
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

seedDB();


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


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.disable('x-powered-by');

// Campground.create({
//   name: "Granite Hill",
//   image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg",
//   description: 'This is a huge granite hill, no bathrooms. No water. Beautiful granite!'
// }, function (err, campground) {
//   if (err) {
//     console.log('An error occurred while adding to the database.');
//     console.log(err);
//   } else {
//     console.log('Campground successfully added.');
//     console.log(campground);
//   }
// });

app.get('/', function (req, res) {
  res.render('landing');
});

app.get('/campgrounds', function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: description
  };

  Campground.create(newCampground, function (err, campground) {
    if (err) {
      console.log('An error occurred while adding new campground');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/new', function (req, res) {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function (req, res) {
  var id = req.params.id;
  Campground.findById(id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
  // res.send('This will be the show page one day.');
});


// =======================
// COMMENTS ROUTE
// =======================

app.get('/campgrounds/:id/comments/new', function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: foundCampground});
    }
  });
});

app.post('/campgrounds/:id/comments', function (req, res) {
  Campground.findById(req.params.id, function (err, foundCamground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
          res.redirect('/campgrounds');
        } else {
          foundCamground.comments.push(comment._id);
          foundCamground.save(function (err) {
            if (err) {
              console.log('/campgrounds');
            } else {
              res.redirect('/campgrounds/' + foundCamground._id);
            }
          });
        }
      });
    }
  })
});


// ==================
// AUTH ROUTES
// ==================

// Show register form
app.get('/register', function (req, res) {
  res.render('register');
});

// Handle sign up logic
app.post('/register', function (req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), function (req, res) {
});

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});