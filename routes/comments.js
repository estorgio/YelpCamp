var express = require('express');
var router = express.Router({mergeParams: true});

var Campground = require('../models/campground');
var Comment = require('../models/comment');

// Comments New
router.get('/new', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: foundCampground});
    }
  });
});

// Comments Create
router.post('/', isLoggedIn, function (req, res) {
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
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
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

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      console.log(err);
      return res.redirect('back');
    }
    res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
  });
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      console.log(err);
      return res.redirect('back');
    }
    res.redirect('/campgrounds/' + req.params.id);
  });
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/campgrounds/' + req.params.id);
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        console.log(err);
        return res.redirect('back');
      }
      if (foundComment.author.id.equals(req.user._id)) {
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