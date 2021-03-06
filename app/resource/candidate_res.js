var BaseRes = require('./base_res')
  , _ = require('underscore')
  , CandidateStore = require('../sdk/candidatestore.js')
  , csv = require('fast-csv')
  , http = require('http')
  , querystring = require('querystring')
  , fs = require('fs');

var CandidateRest = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/',  _.bind(this.home, this));
    app.get('/login', _.bind(this.login, this));
    //Note: To add auth back- add "this.ensureAuthenticated,"" as parameter
    //app.post('/load', this.ensureAuthentihcated, _.bind(this.load, this));
	  app.post('/load', _.bind(this.load, this));
	  app.get('/import',  _.bind(this.upload, this));
    app.get('/candidate/add',  _.bind(this.showCandidateAdd, this));
    app.post('/candidate/add',  _.bind(this.addCandidate, this));
    app.post('/candidate/changestate', _.bind(this.changeState, this));
    app.post('/positions/add',  _.bind(this.addNewPosition, this));
    app.post('/candidate/changeowner',   _.bind(this.changeOwner, this));
    app.post('/candidate/changeduedate',   _.bind(this.changeDueDate, this));
    app.post('/candidate/changenote',  _.bind(this.changeNote, this));
    app.post('/funnelStats',  _.bind(this.funnelStats, this));
    /* fake add user */
    app.get('/adduser',  _.bind(this.showAddUser, this));
    app.post('/adduser',  _.bind(this.addUser, this));
    app.post('/resume',  _.bind(this.addResume, this));
    app.post('/parseresume',  _.bind(this.parseResume, this));

  },


  addCandidate : function (req,res) {
    var store = new CandidateStore();
    store.addCandidate(req.body, function (candidate) {
      res.redirect('/');
    });
  },

  parseResume : function (req,res) {
var vcap_services = JSON.parse(process.env.VCAP_SERVICES)
var post_data = querystring.stringify({
            'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
            'output_format': 'json',
            'output_info': 'compiled_code',
            'warning_level' : 'QUIET',
            'file' : req.files[0],
            'apikey' : vcap_services.haventext.apikey
        });

        // An object of options to indicate where to post to
        var post_options = {
            host: 'api.havenondemand.com',
            port: '80',
            path: '/1/api/sync/extracttext/v1',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        var content = "";
        // Set up the request
        var post_req = http.request(post_options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
            response.on('error', function(e){console.log(e)});
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
        res.send({'content':content});
  },

  changeState : function (req,res) {
    var store = new CandidateStore();
    store.changeCandidateState(req.body, function (candidate) {
      res.redirect('/');
    });
  },

  changeOwner : function (req,res) {
    var store = new CandidateStore();
    store.changeCandidateOwner(req.body, function (candidate) {
      res.redirect('/');
    });
  },

  changeDueDate : function (req,res) {
    var store = new CandidateStore();
    store.changeCandidateDueDate(req.body, function (candidate) {
      res.redirect('/');
    });
  },

  changeNote : function (req,res) {
    var store = new CandidateStore();
    store.changeCandidateNote(req.body, function (candidate) {
      res.redirect('/');
    });
  },

  funnelStats : function (req,res) {
    var rec = req.body['Recruiter_PersonId'];
    //Replacing analytics call with sample data
    var overallStats = [10, 6, 2, 1, 0];
    var overallAggregate = [100, 60, 33, 50, 0];
    var overall= { funnel : overallStats, aggragate : overallAggregate};
    var weeklyStats = [8, 4, 3, 1, 1];
    var weeklyAggregate = [100, 50, 75, 33, 100];
    var weekly = { funnel : weeklyStats, aggragate : weeklyAggregate};
    res.send({ overallFunnelStats : overall, weeklyFunnelStats : weekly});
  },

  showCandidateAdd : function (req, res) {
    var store = new CandidateStore();
    store.getPositions( function (err, positions) {
      var pos = positions;

      store.getRecruiters( function(err, recruiters) {
        var recs = recruiters;
        store.getPersons( function(err, persons) {
          var pers = persons;
          res.render('app/addcandidate' , {positions : pos,  recruiters : recs, owners : pers });
        });
      });
    });
  },

  /* Hacking add user fake */
  showAddUser : function (req, res) {
	 var store = new CandidateStore();
	 store.getPositions( function (err, positions) {
	   var pos = positions;

	   store.getRecruiters(function(err, recruiters) {
	     var recs = recruiters;
	     store.getPersons(function(err, persons) {
	       var pers = persons;
	       res.render('app/adduser' , {positions : pos,  recruiters : recs, owners : pers });
	     });
	   });
	 });
  },

  addUser : function (req,res) {
	 var store = new CandidateStore();
	 store.addCandidate(req.body, function (candidate) {
	   res.redirect('/');
	 });
  },

  login: function (req, res) {
    res.render('app/login');
  },

  upload: function (req, res) {
	res.render('app/import', {candidates : null});
  },

  addNewPosition : function (req, res) {
    var store = new CandidateStore();
    store.addPosition(req.body, function (position) {
      res.json(position);
    });
  },

   addResume : function (req,res) {

    
        var post_data = querystring.stringify({
            'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
            'output_format': 'json',
            'output_info': 'compiled_code',
            'warning_level' : 'QUIET',
            'url' : 'https://drive.google.com/uc?export=download&id=0B2I7CyCRi87KY09nQjYyR2dhelk',
            'apikey' : '9cdc2f3a-361e-4c5f-bd8d-63532ee6fc4b'
        });

        // An object of options to indicate where to post to
        var post_options = {
            host: 'api.havenondemand.com',
            port: '80',
            path: '/1/api/sync/extracttext/v1',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        var content = "";
        // Set up the request
        var post_req = http.request(post_options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
            response.on('error', function(e){console.log(e)});
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
        res.send({'content':content});
    
  },

  load: function (req, res){
	console.log(req.files);


	var stream = fs.createReadStream(req.files.csvinput.path);

	csv.fromStream(stream, {headers : true})
		.on("data", function(data){
			console.log(data);

		})
		.on("end", function(){
			console.log("done");
		});

      res.render('app/import', {candidates: null});
  },

  home : function (req,res) {
    var store = new CandidateStore();
    store.getCandidates( function (err, candidates) {
      var filtered = candidates.results;
      if(req.query.rec && req.query.rec != "all"){
        console.log("filter: " +req.query.rec);
        filtered = _.filter(candidates.results, function (can){
          return can.Recruiter_PersonId == req.query.rec;
        });
      }
      if(req.query.own && req.query.own != "all"){
        filtered = _.filter(filtered, function (can){ return can.Owner_PersonId == req.query.own; });
      }

      var grouped = _.groupBy(filtered , function (can) {
        return  can.state.name;
      });

      var results = [];
      for(var state in grouped) {
        results.push({
          name : state,
          id : grouped[state][0].State_Id,
          candidates : grouped[state]
        });
      }

      grouped = _.sortBy (results, function (group) {
        return group.candidates[0].state.order;
      });

      store.getStates( function (err, states) {
        var all_states = states.results;
        store.getRecruiters(function (err, recruiters) {
          store.getPersons(function (err, persons) {
            var options = { persons : persons, recruiters : recruiters, candidates : grouped, all_states : all_states };
            res.render('app/home' , options);
          });
        });
      });
    });
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }
});
