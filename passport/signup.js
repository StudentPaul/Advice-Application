/**
 * Created by socio on 11/30/2016.
 */
var LocalStrategy   = require('passport-local').Strategy;
//var User = require('../models/user');
var DAO = require('../models/DAO');


module.exports = function(passport){

  passport.use('signup', new LocalStrategy({
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      process.nextTick(DAO.findOrCreateUser(req, username, password, done));
    }));
}