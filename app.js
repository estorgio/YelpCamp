var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.get('/', function (req, res) {
  res.render('landing');
});

app.get('/campgrounds', function (req, res) {
  var campgrounds = [
    {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
    {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"}
  ];

  res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(3000, function () {
  console.log('App has started on port 3000.');
});