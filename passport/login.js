/**
 * Created by socio on 12/24/2016.
 */

var LocalStrategy   = require('passport-local').Strategy;
var DAO = require('../models/DAO');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

  passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },DAO.findUser)
  );




}