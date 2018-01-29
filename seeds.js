var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
    description: "Nice campsite"
  },
  {
    name: "Desert Mesa",
    image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
    description: "Nice campsite tho"
  },
  {
    name: "Canyon Floor",
    image: "https://farm9.staticflickr.com/8038/7930463550_42c3f82870.jpg",
    description: "Currently deserted"
  }
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Removed campgrounds');

      Comment.remove({}, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Removed comments');

          // add a few campgrounds
          data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
              if (err) {
                console.log(err);
              } else {
                console.log('Campground created');

                // create a comment
                Comment.create({
                  text: "This place is great, but I wish there was an Internet",
                  author: "Homer"
                }, function(err, comment) {
                  if (err) {
                    console.log(err);
                  } else {
                    campground.comments.push(comment._id);
                    campground.save(function (err) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log('Added a new comment');
                      }
                    });
                  }
                });
              }
            })
          });

        }
      });
    }
  });
  // add a few comments
}

module.exports = seedDB;

