var klass = require('klass')
  , mysql = require('mysql')
  , _ = require('underscore')
  , crypto = require('crypto');

var CandidateStore = module.exports = klass(function () {

  // constructor
}).methods({
    getCandidates : function (done) {
      var r = {
        results:
        [
          {
            firstName : "Robert",
            lastName : "Youngjohns",
            email: "robert@hpe.com",
            tagLine : "Running for President in 2016",
            DueDate : "6/4/2016",
            state : {
              name : "Lead",
              icon : "icon-inbox",
              order : 0
            }
          },
          {
            firstName : "Omri",
            lastName : "Gazitt",
            email: "omri@hpe.com",
            tagLine : "Seattle- the cloud capital of the world",
            DueDate : "6/9/2016",
            state : {
                name : "Interview" ,
                icon : "icon-user",
                order : 2
              }
          },
          {
            firstName : "Colin",
            lastName : "Mahoney",
            email: "colin@hpe.com",
            DueDate : "6/1/2016",
            tagLine : "The next American IDOL (on demand)",
              state : {
                name : "Phone Screen" ,
                icon : "icon-phone-alt",
                order : 1
              }
          },
          {
            firstName : "Manav",
            lastName : "Mishra",
            email: "manav@hpe.com",
            DueDate : "6/24/2016",
            tagLine : "Go big or go home",
              state : {
                name : "Offer" ,
                icon : "icon-us",
                order : 4
              }
          },
          {
            firstName : "Phani",
            lastName : "Raju",
            email: "phani@hpe.com",
            DueDate : "6/2/2016",
            tagLine : "I can build anything in a weekend",
              state : {
                name : "Lead" ,
                icon : "icon-inbox",
                order : 0
              }
          }
        ]
      };

      var self = this;

      var enc = [];
      _.each(r.results, function (can,i ) {
        enc.push( self.__encryptCandidate(can));
      });

      var dec = [];

      _.each(enc, function (can,i ) {
        dec.push( self.__decryptCandidate(can));
      });

      done(null, { results : dec});
    },

    getRecruiters: function (done) {
      var r = {
        results:
        [
          {
            FirstName : "Betty",
            LastName : "Jones",
            tagLine : "Batman",
          },
          {
            FirstName : "Travis",
            LastName : "Plummer",
            tagLine : "Hunt Hogs on a Helicopter",
          }
        ]
      };
      var self = this;

      var enc = [];
      _.each(r.results, function (can,i ) {
        enc.push( self.__encryptCandidate(can));
      });

      var dec = [];

      _.each(enc, function (can,i ) {
        dec.push( self.__decryptCandidate(can));
      });
      console.log("recruiters");
      console.log(dec);
      done(null, dec);
    },

    getPersons: function (done) {
      var r = {
        results:
        [
          {
            FirstName : "Vaishali",
            LastName : "Gupta",
            emailAddress : "vaishi@bar.com",
          },
          {
            FirstName : "Travis",
            LastName : "Plummer",
            emailAddress : "foo@bar.com",
          }
        ]
      };

       var self = this;

      var enc = [];
      _.each(r.results, function (can,i ) {
        enc.push( self.__encryptCandidate(can));
      });

      var dec = [];

      _.each(enc, function (can,i ) {
        dec.push( self.__decryptCandidate(can));
      });
      console.log("persons");
      console.log(dec);
      done(null, dec);
    },
    
    getStates: function (done){
      done(null, {
        results: [
          {
            StageId: 1,
            Name : 'Lead'
          },
          {
            StageId: 2,
            Name : 'Phone Screen'
          },
          {
            StageId: 3,
            Name : 'Interview'
          },
          {
            StageId: 4,
            Name : 'Offer'
          }
        ]
      })
    },

    getPositions  : function (done) {
      done(null,
        [
          { PositionId : 0 , Name :"Program Manager"},
          { PositionId : 1 , Name :"Senior SDE"},
          { PositionId : 2 , Name :"Distinguished Technologist"},
          { PositionId : 3 , Name :"Technical Fellow"},
         ]
      
      );
    },

    addCandidate : function(candidate, done) {
      done();
    },

    addPosition : function(position, done) {
      done();
    },

    __encryptCandidate : function (candidate) {
      candidate.firstName = this.__encrypt(candidate.firstName);
      candidate.lastName = this.__encrypt(candidate.lastName);
      candidate.tagLine = this.__encrypt(candidate.tagLine);
      candidate.email = this.__encrypt(candidate.email);
      return candidate;
    },

    __decryptCandidate : function (candidate) {
      candidate.firstName = this.__decrypt(candidate.firstName);
      candidate.lastName = this.__decrypt(candidate.lastName);
      candidate.tagLine = this.__decrypt(candidate.tagLine);
      candidate.email = this.__decrypt(candidate.email);
      return candidate;
    },

    __encrypt : function (text) {
      text = text || "";
      var passPhrase = this.__getPassPhrase();
      var cipher = crypto.createCipher('aes-256-cbc', passPhrase);
      var crypted = cipher.update(text,'utf8','hex');
       crypted += cipher.final('hex');
      return crypted;
    },

    __decrypt : function (crypted) {
      var passPhrase = this.__getPassPhrase();
      var decipher = crypto.createDecipher('aes-256-cbc', passPhrase);
      var dec = decipher.update(crypted,'hex','utf8');
      dec += decipher.final('utf8');
      return dec;
    },

    __getPassPhrase : function () {
      return process.env.passPhrase;
    }
});
