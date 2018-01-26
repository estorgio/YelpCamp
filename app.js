var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp', function (err) {
  if (err) {
    console.log('An error occurred while connecting to the database.');
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.disable('x-powered-by');

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Granite Hill",
//   image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"
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
      res.render('campgrounds', {campgrounds: allCampgrounds});
    }
  });
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {
    name: name,
    image: image
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

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});