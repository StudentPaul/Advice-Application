/**
 * Created by socio on 12/24/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

var User = require('../models/user');
var Question = require('../models/question');
var Answer = require('../models/answer');
var DAO = require('../models/DAO')(User, Question, Answer);

var async = require('async');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  //downhere should be not redirection to main page, because we have SPA. Instead, we need to send message about auth err
  //or low level of access
  res.send('Unauthorized. Please, log in before you can do smth');
 // res.redirect('/unauthorized')
}
module.exports = function (passport) {
  router.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname,'../index.html'));
  });

 //nothing
 /* router.post('/signup',passport.authenticate('signup'), function (req,res) {
     res.send('URAAAAA')
  });
  */
 router.post('/signup', function (req,res,next) {
  DAO.findOrCreateUser(req, function (err, user) {
    if (err){
      return res.send(err.message)
    }
    return res.json(JSON.stringify(user));
  })
  });

  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  router.post('/login', function (req, res, next) {
    passport.authenticate('login', function(err, user, info) {
      if (err) { return next(err); } //error exception

      // user will be set to false, if not authenticated
      if (!user) {
        res.status(401).json(info); //info contains the error message
      } else {
        // if user authenticated maintain the session
        req.logIn(user, function() {
          req.session.userId = user._id;
          res.json(JSON.stringify({
            userName: user.username,
            firstName: user.firstName,
            lastName: user.lastName
          }));
          //console.log('LOGGED ON: USER ID: '+req.session.userId);
        })
      }
    })(req, res, next);
  });


  router.get('/getOwnQuestions', isAuthenticated, function(req, res){
    DAO.getUserQuestions(req.session.userId, function (err, users) {
      if (err){
        res.send(err);
      }
      res.json(JSON.stringify(users));
    })
  });
  router.get('/getAllQuestions', isAuthenticated, function (req, res) {
    DAO.getAllQuestions(function (err, users) {
      if (err){
        res.send(err);
      }
      res.json(JSON.stringify(users));
    })
  });

  router.post('/addQuestion', isAuthenticated, function(req, res){
    DAO.addQuestion(req.param('title'),req.param('question'),req.session.userId, function (err, question) {
      if(err){
        res.send('error while adding question'+err);
      }
      res.json(JSON.stringify(question));
    })
  });
  router.get('/deleteQuestion/:questionId', isAuthenticated, function(req, res){
    DAO.isQuestionOwner(req.session.userId,req.params.questionId,function (err, isAuthor) {
      if (err){
        res.send(err)
      }
      if(isAuthor){
        DAO.deleteQuestion(req.params.questionId, function (err, question) {
          if (err){
            res.send(err)
          }
          res.json(JSON.stringify(question));
        })
      }
      else{
        res.send('You cant delete the question you dont own');
      }
    })
  });
  router.post('/answerQuestion', isAuthenticated, function(req, res){
    DAO.addAnswer(req.param('questionId'),req.param('answer'),req.session.userId,null, function (err, answer) {
      if(err){
        res.send('error while adding answer'+err);
      }
      res.json(JSON.stringify(answer));
    })
  }
  );
  router.get('/getQuestionAnswers/:questId', isAuthenticated, function(req, res){
    DAO.getQuestionAnswers(req.params.questId, function (err, answers) {
      if (err){
        res.send(err);
      }
      async.map(answers,
        function (answer, callback){
        DAO.findUserById(answer.authorId, function (err, user) {
          if(err){
            res.send(err)
          }
          answer.author = user.username;
          callback(null, {author: user.username, answer: answer.answer, date: answer.date});
        });},
        function (err, result) {
        res.json(JSON.stringify(result));
        })
    })
  });
  router.get('/logout', function(req, res){
    //req.logout();
    req.session.destroy(function (err) {
      res.redirect('/');
    });

  });


  //handle request which hasn't matched existing handlers
  router.get('/*',function (req,res) {
    res.send('404 error - not found');
  });

  return router;
}