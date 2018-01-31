// YelpCamp Configuration File
// Please fill in the appropriate settings
// and save this file as 'config.php'

var config = {};

// DATABASE_URI - database URI that points to a MongoDB database
config.DATABASE_URI = 'mongodb://localhost/yelp_camp';

// APP_PORT - the port where app listens for HTTP requests
config.APP_PORT = 3000;

// SESSION_SECRET - random string of characters used to initialize sessions
// (WARNING! DO NOT FORGET TO GENERATE YOUR OWN ID, AT LEAST 64 CHARACTERS)
config.SESSION_SECRET = 'H59TG5xkicoQRr4gv9BijYz26KOKFViv7iio4OAZMlc15PHtuFj7reeYyXtVMvS8';

module.exports = config;