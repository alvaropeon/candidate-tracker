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
  , form = require('reformed')
  , mysql = require('mysql')
  , readline = require('readline');




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

//Ugh- This is bad.  So bad.  But no more Stackato staging hooks
function populateDb(){
  if(process.env.VCAP_SERVICES) {
    var vcap = JSON.parse(process.env.VCAP_SERVICES);
    //var dbConnection =  connection['mysql']['hpcloudrecruit-db'][0];
    var dbConnectionCredentials =  vcap['mysql'][0].credentials;
    var creds =  {
        host: dbConnectionCredentials.host,
        port : dbConnectionCredentials.port,
        user : dbConnectionCredentials.user,
        password : dbConnectionCredentials.password,
        database : dbConnectionCredentials.name
      };
    }
    else{
      var creds =  {
          host : 'localhost',
          port : 3306,
          user : 'helionci',
          password: 'fairgate',
          database : 'hpcloudrecruiting'  
          };
    }
    var connection = mysql.createConnection(creds);
    connection.connect(function(err){
      if(!err) {
          console.log("Database is connected ... nn");    
      } else {
          console.log("Error connecting database ... nn");    
      }
    });
    //World's hackiest thing below
    var sql = "DROP TABLE IF EXISTS `Role`; CREATE TABLE `Role` ( `RoleId` int(11) NOT NULL AUTO_INCREMENT, `Name` varchar(5000) DEFAULT NULL, `Description` varchar(5000) DEFAULT NULL, PRIMARY KEY (`RoleId`), UNIQUE KEY `Id_UNIQUE` (`RoleId`) ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8; LOCK TABLES `Role` WRITE; INSERT INTO `Role` VALUES (1,'Hiring Manager','Hiring Manager'),(2,'Recruiter','Recruiter'); UNLOCK TABLES; DROP TABLE IF EXISTS `Person`; CREATE TABLE `Person` ( `FirstName` varchar(5000) DEFAULT NULL, `LastName` varchar(5000) DEFAULT NULL, `EmailAddress` varchar(5000) DEFAULT NULL, `Role_RoleId` int(11) NOT NULL, `PersonId` int(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`PersonId`), UNIQUE KEY `PersonId_UNIQUE` (`PersonId`), KEY `fk_Person_Role_idx` (`Role_RoleId`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8; LOCK TABLES `Person` WRITE; INSERT INTO `Person` VALUES ('Smith','Jack','jack.smith@example.com',1,1),('Doe','Joe','joe.doe@example.com',2,2); UNLOCK TABLES; DROP TABLE IF EXISTS `Position`; CREATE TABLE `Position` ( `PositionId` int(11) NOT NULL AUTO_INCREMENT, `Name` varchar(5000) DEFAULT NULL, `Description` varchar(5000) DEFAULT NULL, `DatePosted` datetime, `JobLink` varchar(100) DEFAULT NULL, PRIMARY KEY (`PositionId`), UNIQUE KEY `Id_UNIQUE` (`PositionId`) ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8; LOCK TABLES `Position` WRITE; INSERT INTO `Position` VALUES (2,'Senior SDE','Senior SDE','2014-10-29 16:46:31','Senior SDE'),(3,'Distinguished Technologist','Distinguished Technologist','2014-10-29 16:57:38','Distinguished Technologist Link'); UNLOCK TABLES; DROP TABLE IF EXISTS `State`; CREATE TABLE `State` ( `StageId` int(11) NOT NULL AUTO_INCREMENT, `Name` varchar(5000) DEFAULT NULL, `Description` varchar(5000) DEFAULT NULL, `Order` int(11) NOT NULL, PRIMARY KEY (`StageId`), UNIQUE KEY `StageId_UNIQUE` (`StageId`), UNIQUE KEY `Order_UNIQUE` (`Order`) ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8; LOCK TABLES `State` WRITE; INSERT INTO `State` VALUES (1,'Lead','Candidaate entered into the system',1),(2,'Phone Screen','Candidaate entered into the system',2),(3,'Interview','Candidaate entered into the system',3),(4,'Offer','Candidaate entered into the system',4),(5,'Accepted','Candidaate entered into the system',5),(6,'Withdrawn','Candidaate entered into the system',6),(7,'Rejected','Candidaate entered into the system',7); UNLOCK TABLES; CREATE TABLE if not exists `Candidate` ( `CandidateId` int(11) NOT NULL AUTO_INCREMENT, `FirstName` varchar(500) DEFAULT NULL, `LastName` varchar(500) DEFAULT NULL, `Notes` varchar(5000) DEFAULT NULL, `EmailAddress` varchar(5000) DEFAULT NULL, `Position_PositionId` int(11) NOT NULL, `Recruiter_PersonId` int(11) NOT NULL, `Owner_PersonId` int(11) NOT NULL, `CurrentStage` int(11) DEFAULT NULL, `DueDate` datetime DEFAULT NULL, `LastModified` datetime, `TagLine` varchar(5000) DEFAULT NULL, PRIMARY KEY (`CandidateId`), UNIQUE KEY `CandidateId_UNIQUE` (`CandidateId`), KEY `fk_Candidate_Position1_idx` (`Position_PositionId`) ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8; INSERT INTO `Candidate` VALUES (1,'Bob','Peterson','Very talented UX designer','bob_peterson@hp.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,CURDATE(), 'The best in the biz'); INSERT INTO `Candidate` VALUES (2,'Mary','Johnson','Star cloud dev','mary.johnson@example.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,CURDATE(), 'The best in the biz'); INSERT INTO `Candidate` VALUES (3,'John','Smith','Experienced network engineer','john.smith@example.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,CURDATE(), 'The best in the biz'); INSERT INTO `Candidate` VALUES (4,'Jane','Jones','Experienced network engineer','jane.jones@example.com',1,1,1,1,CURDATE() + INTERVAL 12 DAY,CURDATE(), 'The best in the biz’);";
    connection.query(sql, function(err, rows, fields) {
    connection.end();
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.' + err);
      });
}


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
  //downloadPassPhrase();
  console.log('Encryption Key location not given, cannot download encryption key!');
  console.log('Hard coding the passphrase- only for demo purposes.  You would never do this with a real app');
  process.env.passPhrase = "AAAAB3NzaC1yc2EAAAABJQAAAQEAty86+VzjC8gPqdgWk4+CY4hEUNXlSWsTtY+fvHux89DqnMjNSFbBSmYYyV3pWAIlOPLuDGc1VdE79YcDZsspzyB0usuSZgH3u5APyuMuIBtF078oaukgotBn/EzGYPK+bBfgYZPPLUmF+sZeI4FNQvl+6nsjtxBy4Z5n4yrUjFVeuAuhsUz0OG7MVZtSQw7VxODd67RJk+2QZhHEZ7WmayR1WgvzRrGqJq8Nc15qznubpmbijnrdUx7yCpXbdN8K3RefbHC56kd3VZ6cSyxSaNZsrA5olB0mwWzeugFTnv6pQFqfh0yqwiekuEX0CGcHcANi+D5lgZ+eoYyg10uBqQ==";
  //I'm so sorry for this- just trying to get some data initialized, quickly.
  populateDb();
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