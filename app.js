var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
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
      res.render('index', {campgrounds: allCampgrounds});
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
  res.render('new');
});

app.get('/campgrounds/:id', function (req, res) {
  var id = req.params.id;
  Campground.findById(id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {campground: foundCampground});
    }
  });
  // res.send('This will be the show page one day.');
});

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});