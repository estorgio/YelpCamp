var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp', function (err) {
  if (err) {
    console.log('An error occurred while connecting to the database.');
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

seedDB();

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
  Campground.find({}, function(err, allCampgrounds) {
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
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
          res.redirect('/campgrounds');
        } else {
          foundCamground.comments.push(comment._id);
          foundCamground.save(function(err) {
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

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});