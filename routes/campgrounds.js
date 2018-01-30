var express = require('express');
var router = express.Router();

var Campground = require('../models/campground');

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
router.post('/', isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
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
router.get('/new', isLoggedIn, function (req, res) {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
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

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', checkCampgroundOwndership,function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      console.log(err);
      return res.redirect('/campgrounds');
    }
    res.redirect('/campgrounds/' + updatedCampground._id);
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/campgrounds');
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkCampgroundOwndership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        console.log(err);
        return res.redirect('back');
      }
      console.log(foundCampground.author.id);
      console.log(req.user._id);
      if (foundCampground.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;