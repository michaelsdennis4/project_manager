var express   = require('express');
var session 	= require('express-session');
var app       = express();

var morgan  = require('morgan');
app.use(morgan('combined'));

var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// app.get('stylesheets/normalize.css', function(req, res) {
// 	res.sendFile('stylesheets/normalize.css');
// });

app.get('stylesheets/style.css', function(req, res) {
  res.sendFile('stylesheets/style.css');
});

app.get('/', function(req, res){
  res.render('login.ejs')
});

app.get('/dashboard', function(req, res) {
	res.render('dashboard.ejs')
});

app.get('/logout', function(req, res) {
	res.redirect('/');
})

