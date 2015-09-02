var PORT = (process.env.PORT || 3000)
  , HOST = (process.env.VCAP_APP_HOST || 'localhost');

// Extending EJS with a filter to format date using moment framework.
ejs = require('ejs');
moment = require('moment');
ejs.filters.formatDueDate = function(date){
  return moment(date).fromNow()
}

ejs.filters.formatDueDateColor = function(date){
  if(moment(date).diff(moment(), 'days') <= 0){
    return '#d9534f';
  }
  else{
    if(moment(date).diff(moment(), 'days') > 5){
      return '#5cb85c';
    }
    else{
      return '#f0ad4e';
    }

  }
}
ejs.filters.formatBarRed = function(candidates){
  var total = candidates.length;
  var red = 0;
  var green = 0;
  var yellow = 0;
  for(var i=0; i<candidates.length; i++){
    if(moment(candidates[i].DueDate).diff(moment(), 'days') <= 0){
      red = red + 1;
    }
    else{
     if(moment(candidates[i].DueDate).diff(moment(), 'days') > 5){
      green = green + 1;
      }
      else{
        yellow = yellow + 1;
      }
    }
  }
 return Math.round((red/total)*100);
}

ejs.filters.formatBarYellow = function(candidates){
  var total = candidates.length;
  var yellow = 0;
  var green = 0;
  var red = 0;
  for(var i=0; i<candidates.length; i++){
    if(moment(candidates[i].DueDate).diff(moment(), 'days') <= 0){
      red = red + 1;
    }
    else{
     if(moment(candidates[i].DueDate).diff(moment(), 'days') > 5){
      green = green + 1;
      }
      else{
        yellow = yellow + 1;
      }
    }
  }
 return Math.round((yellow/total)*100)
}

ejs.filters.formatBarGreen = function(candidates){
  var total = candidates.length;
  var red = 0;
  var yellow = 0;
  var green = 0;
  for(var i=0; i<candidates.length; i++){
    if(moment(candidates[i].DueDate).diff(moment(), 'days') <= 0){
      red = red + 1;
    }
    else{
     if(moment(candidates[i].DueDate).diff(moment(), 'days') > 5){
      green = green + 1;
      }
      else{
        yellow = yellow + 1;
      }
    }
  }
 return Math.round((green/total)*100);
}


//console.log(ejs.filters.formatDueDate);

var fs = require('fs')
  , express = require('express')
  , app = express.createServer()
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , session = require('express-session')
  , https = require('https')
  , url = require('url')
  , busboy = require('connect-busboy')
  , form = require('reformed');


// Config
app.set('views', __dirname + '/app/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');

app.configure(function(){
  app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
  app.use(express.bodyParser());
  app.use(session({ secret: 'HPSECRET' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    return done(null, {});
  }
));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Resources
function bootResources(app) {
  fs.readdir(__dirname + '/app/resource', function (err, files){
    if (err) { throw err; }
    files.forEach(function (file){
      if ((file.indexOf("~") > -1) || (file.indexOf(".svn") > -1)) {
        return;
      }

      var name = file.replace('.js', '')
        , Res = require('./app/resource/' + name);

      if (typeof Res !== 'function') {
        return; // since this isn't a resource
      }

      if (typeof Res.prototype.route !== 'function') {
        return; // since this isn't a resource
      }

      var r = new Res();
      r.route(app);
    });
  });
}

bootResources(app);

if (!module.parent) {
  downloadPassPhrase();
  app.listen(PORT);
  console.log('App started on port: ' + PORT);
}

function downloadPassPhrase() {

  var keyLocation;

	if(!process.env.CryptoKey) {
		console.log('Encryption Key location not given, cannot download encryption key!');
		console.log('Hard coding the passphrase- only for demo purposes.  You would never do this with a real app');
		process.env.passPhrase = "AAAAB3NzaC1yc2EAAAABJQAAAQEAty86+VzjC8gPqdgWk4+CY4hEUNXlSWsTtY+fvHux89DqnMjNSFbBSmYYyV3pWAIlOPLuDGc1VdE79YcDZsspzyB0usuSZgH3u5APyuMuIBtF078oaukgotBn/EzGYPK+bBfgYZPPLUmF+sZeI4FNQvl+6nsjtxBy4Z5n4yrUjFVeuAuhsUz0OG7MVZtSQw7VxODd67RJk+2QZhHEZ7WmayR1WgvzRrGqJq8Nc15qznubpmbijnrdUx7yCpXbdN8K3RefbHC56kd3VZ6cSyxSaNZsrA5olB0mwWzeugFTnv6pQFqfh0yqwiekuEX0CGcHcANi+D5lgZ+eoYyg10uBqQ==";
		return;
	}
  else
  {
  	var keyLocation = url.parse(process.env.CryptoKey);

  	var options = {
  		host: keyLocation.host,
  		port: keyLocation.port,
  		path: keyLocation.path
  	};

  	https.get(options, function(resp){
  		console.log('Downloading encryption key...');
  		var data = '';

  		resp.on('data', function(chunk){
  			data += chunk;
  		});

  		resp.on('end', function() {
  			process.env.passPhrase = data;
  			console.log('Encryption key downloaded');
  		});

  	}).on("error", function(e){
  		console.log("Encryption key could not be downloaded: " + e.message);
  	});
  }
}

module.exports = app;
