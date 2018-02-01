var express = require('express');
var router = express.Router();

var Campground = require('../models/campground');
var middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// CREATE - add new campgrounds to DB
router.post('/', middleware.isLoggedIn, function (req, res) {
  var newCampground = req.body.campground;
  if (newCampground.price) {
    newCampground.price = parseFloat(parseFloat(newCampground.price).toFixed(2));
  }
  newCampground.author = {
    id: req.user._id,
    username: req.user.username
  };
  Campground.create(newCampground, function (err, campground) {
    if (err) {
      console.log('An error occurred while adding new campground');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
  var id = req.params.id;
  Campground.findById(id).populate('comments').exec(function (err, foundCampground) {
    if (err || !foundCampground) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
  // res.send('This will be the show page one day.');
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', 'YelpCamp has encountered a problem and is unable to proceed.');
      return res.redirect('/campgrounds/' + req.params.id);
    }
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  var campground = req.body.campground;
  if (campground.price) {
    campground.price = parseFloat(parseFloat(campground.price).toFixed(2));
  }
  Campground.findByIdAndUpdate(req.params.id, campground, function (err, updatedCampground) {
    if (err || !updatedCampground) {
      console.log(err);
      return res.redirect('/campgrounds');
    }
    res.redirect('/campgrounds/' + updatedCampground._id);
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/campgrounds');
  });
});

module.exports = router;