var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan  = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');
var exphbs  = require('express-handlebars');

var port = process.env.PORT || 3000;
var app = express();

mongoose.connect(configDB.url, function(err){
	console.log('connected to db');
});
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, 'public')));


// required for passport

app.use(session({ secret: 'kevinbacino' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./routes/index.js')(app, passport); 



app.listen(port, function(){
  console.log('server running on port 3000');
});


module.exports = app;

