var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.disable('x-powered-by');

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
  {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
  {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
  {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"}
];

app.get('/', function (req, res) {
  res.render('landing');
});

app.get('/campgrounds', function (req, res) {
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {
    name: name,
    image: image
  };

  campgrounds.push(newCampground);

  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function (req, res) {
  res.render('new');
});

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});