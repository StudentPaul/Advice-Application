/**
 * Created by socio on 12/27/2016.
 */
var mocha = require('mocha');
var assert = require('assert');
var sinon = require('sinon');


describe('Testing test', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('DAO tests', function () {
  describe('#findOrCreateUser', function () {
    //mock for User mongoose model
    var User = function () {
    };
    User.prototype.save = function (done) {
      done(null)
    };
    //not found such a user in db
    User.findOne = function (queryObj, done) {
      return done(null, null)
    };
    //DAO filled with stub
    var DAO = require('../models/DAO')(User, null, null);
    //
    it('user with appropriate data registered', function (done) {

      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pavlo111'
          }
          if (paramName === 'password') {
            return '1234'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //


      DAO.findOrCreateUser(req, function (err, user) {
        if (err) {
          return done(err)
        }
        return done()
      })
    })

    it('too short name throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pa'
          }
          if (paramName === 'password') {
            return '1234'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('Username length must be from 3 to 12 chars', err.message);
        return done()
      })

    })
    it('too long name throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'PavloAndrusiak'
          }
          if (paramName === 'password') {
            return '1234'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('Username length must be from 3 to 12 chars', err.message);
        return done()
      })

    })
    it('uncorrect username chars throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pav%'
          }
          if (paramName === 'password') {
            return '1234'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('Username should contain only letters and numbers', err.message);
        return done()
      })

    })
    it('uncorrect password chars throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pavlo'
          }
          if (paramName === 'password') {
            return '123  4'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('Password should contain only letters and numbers', err.message);
        return done()
      })

    })
    it('too short password throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pavlo'
          }
          if (paramName === 'password') {
            return '12'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('Password length must be from 3 to 12 chars', err.message);
        return done()
      })

    })
    it('too long password  throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pavlo'
          }
          if (paramName === 'password') {
            return '1235235dsgdfg345325'
          }
          if (paramName === 'email') {
            return 'soc@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('Password length must be from 3 to 12 chars', err.message);
        return done()
      })

    })
    it('invalid email  throws Error', function (done) {
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pavlo'
          }
          if (paramName === 'password') {
            return '123fd'
          }
          if (paramName === 'email') {
            return 'socukr'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('email is not valid', err.message);
        return done()
      })

    })


    it('if user is already in database throws error ', function (done) {
      // change stub's state to find same user in DB
      User.findOne = function (queryObj, done) {
        return done(null, true) //user with such username was found
      };
      //mock for request object
      var req = {
        param: function (paramName) {
          if (paramName === 'username') {
            return 'Pavlo'
          }
          if (paramName === 'password') {
            return '123fd'
          }
          if (paramName === 'email') {
            return 'socio@ukr.net'
          }
        }
      };
      //
      DAO.findOrCreateUser(req, function (err, user) {
        assert.equal('user already exists', err.message);
        return done()
      })

    })
  });
  describe('#addQuestion', function (done) {
      //stub for User mongoose model
      var Question = function () {
      };
      Question.prototype.save = function (done) {
        return done(null);
      }
      //DAO filled with stub
      var DAO = require('../models/DAO')(null, Question, null);
      //
      it('Title and question appropriate length', function (done) {
        DAO.addQuestion("Question title", "Question text",234234, function (err, user) {
          assert.equal(null, err);
          return done()
        })

      });
    it('Too long title throws error', function (done) {
      DAO.addQuestion(Array(20).join("Title"),
        "Question text",234234, function (err, user) {
        assert.equal('Title length must be less than 64 and not blank', err.message);
        return done()
      })

    });
    it('Too long question length throws error', function (done) {
      DAO.addQuestion("Question title",
        Array(50).join("Question"),
        234234, function (err, user) {
          assert.equal('Question length must be less than 256 and not blank', err.message);
          return done()
        })

    });
    })
})