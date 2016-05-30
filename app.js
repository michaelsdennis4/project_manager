var express   = require('express');
var session 	= require('express-session');
var app       = express();

var morgan  = require('morgan');
app.use(morgan('combined'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var methodOverride = require('method-override');
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  };
}));

var bcrypt = require('bcryptjs');

var MongoDB     = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectId    = MongoDB.ObjectID;
var mongoUri    = process.env.MLAB_URI_PROJECT_MANAGER;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({secret: 'HEWUFH3IUFHIOB'}));  
app.use(express.static('public'));

console.log('connecting to MongoDB');
MongoClient.connect(mongoUri, function(error, db) {
  if (error) throw error;

	app.listen(app.get('port'), function() {
	  console.log('Node app is running on port', app.get('port'));
	});

	app.get('stylesheets/style.css', function(req, res) {
	  res.sendFile('stylesheets/style.css');
	});

	app.get('/', function(req, res){
	  res.redirect('/login')
	});

  app.get('/dashboard', function(req, res) {
    if ((req.session.user_id) && (req.session.user_id != null)) {
      res.render('dashboard', {session: req.session});
    } else {
      res.redirect('/');
    };
  });

	app.get('/login', function(req, res){
	  res.render('login.ejs')
	});

	app.post('/login', function(req, res) {
		db.collection('users').find({email: req.body.email}).toArray(function(error, results) {
      if ((error) || (results.length == 0)) {
        res.json({message: 'User not found'});
      } 
      else {
        var user = results[0];
        if (bcrypt.compareSync(req.body.password, user.password_digest) === true) {
          session = req.session;
          session.user_id = user._id;
          user.first_name = user.first_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
          user.last_name = user.last_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
          session.username = user.first_name +' '+user.last_name;
          res.json({message: 'ok'});
        } else {
          res.json({message: 'Incorrect password'});
        };
      };
    });
	});

	app.get('/logout', function(req, res) {
		req.session.user_id = null;
    req.session.username = null;
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      };
    });
	});

	app.get('/signup', function(req, res){
	  res.render('signup.ejs')
	});

	app.post('/users', function(req, res){
    db.collection('users').find({email: req.body.email}).toArray(function(error, users) {
      if (users.length > 0) {
        res.json({message: 'User already exists'});
      } 
      else if (req.body.password != req.body.confirm_password) { 
        res.json({message: 'Passwords do not match'});
      } 
      else if (req.body.first_name.length === 0) {
        res.json({message: 'First name cannot be blank'});
      }
      else if (req.body.last_name.length === 0) {
        res.json({message: 'Last name cannot be blank'});
      }
      else if (req.body.email.length === 0) {
        res.json({message: 'Email cannot be blank'});
      }
      else if (req.body.password.length < 6) {
        res.json({message: 'Password must be at least 6 characters.'});
      }
      else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        var new_user = {first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password_digest: hash};
        db.collection('users').insert(new_user, function(error, result) {
          if ((!error) && (result)) {
            session = req.session;
            session.user_id = new_user._id;
            new_user.first_name = new_user.first_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
            new_user.last_name = new_user.last_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
            session.username = new_user.first_name +' '+new_user.last_name;
            res.json({message: 'ok'});
          } else {
            res.json({message: 'Error creating user'});
          };
        });
      };
    });
  });

  app.get('/profile', function(req, res) {
    if ((req.session.user_id) && (req.session.user_id != null)) {
      db.collection('users').find({_id: ObjectId(req.session.user_id)}).toArray(function(error, result) {
        if ((!error) && (result)) {
          res.render('profile', {session: req.session, user: result[0]});
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    };
  });

  app.patch('/users', function(req, res) {
    if ((req.session.user_id) && (req.session.user_id != null)) {
      if (req.body.first_name.length === 0) {
          res.json({message: 'First name cannot be blank'});
      }
      else if (req.body.last_name.length === 0) {
        res.json({message: 'Last name cannot be blank'});
      }
      else if (req.body.email.length === 0) {
        res.json({message: 'Email cannot be blank'});
      }
      else {
        db.collection('users').update({_id: ObjectId(req.session.user_id)}, {$set: {first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email}}, function(error, result) {
          if (!error) {
            var first_name = req.body.first_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
            var last_name = req.body.last_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
            req.session.username = first_name +' '+last_name;
            res.json({message: 'ok'});
          } else {
            res.json({message: 'Error updating profile.'});
          }
        });     
      };
    } else {
      res.json({message: 'login'});
    };
  });

  app.patch('/password', function(req, res) {
    if ((req.session.user_id) && (req.session.user_id != null)) {
      //find user
      db.collection('users').find({_id: ObjectId(req.session.user_id)}).toArray(function(error, results) {
        if ((!error) && (results) && (results.length > 0)) {
          var user = results[0];
          //check if existing password is correct
          if (bcrypt.compareSync(req.body.old_password, user.password_digest) === true) {
            //check if password at least 6 characters
            if (req.body.new_password.length >= 6) {
              //check if new passwords match
              if (req.body.new_password === req.body.confirm_new_password) { 
                //try to update password
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.new_password, salt);
                db.collection('users').update({_id: ObjectId(user._id)}, {$set: {password_digest: hash}}, function(error, result) {
                  if ((!error) && (result)) {
                    res.json({message: 'ok'});
                  } else {
                    res.json({message: 'Error updating password'});
                  }
                });
              } else {
                res.json({message: 'New passwords do not match'});
              } 
            } else {
              res.json({message: 'Password must be at least 6 characters.'});
            }
          } else {
            res.json({message: 'Existing password incorrect'});
          }  
        } else {
          res.json({message: 'login'}); 
        }
      });
    } else {
      res.json({message: 'login'}); 
    }
  });


});

