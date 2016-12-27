/**
 * Created by socio on 12/25/2016.
 */

var User = require('../models/user');
var Question = require('../models/question');
var Answer = require('../models/answer');
var validator = require('validator');

var bCrypt = require('bcrypt-nodejs');
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
module.exports = {
  findOrCreateUser : function(req, username, password, done){
    if(!validator.isEmail(req.param('email'))){
      return done(new Error('email is not valid'))
    }
    if(!validator.isAlphanumeric(req.param('password'))){
      return done(new Error('Password should contain only letters and numbers'))
    }
    if(!validator.isAlphanumeric(req.param('username'))){
      return done(new Error('Username should contain only letters and numbers'))
    }

    return function(){
      User.findOne({ 'username' :  username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists with username: '+username);
          return done(null, false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);
              throw err;
            }
            console.log('User Registration succesful WITH ID='+newUser._id);
            return done(null, newUser);
          });
        }
      });
    }
  },
  findUser: function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username },
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log the error and redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false);
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false); // redirect back to login page
        }
        // User and password both match, return user from done method
        // which will be treated like success
        return done(null, user);
      }
    );

  },
  addQuestion: function (title, question, authId, done) {
    var newQuestion = new Question();
    newQuestion.title = title;
    newQuestion.question = question;
    newQuestion.authorId = authId;
    newQuestion.date = Date.now();
    newQuestion.votesUp = 0;
    newQuestion.votesDown = 0;
    newQuestion.save(function (err) {
      if (err){
        done(new Error('Error while adding question'))
      }
      console.log('Question successfully added');
      done(null, newQuestion);
    })
  },
  getUserQuestions: function (userId, done) {
    Question.find({authorId: userId},function (err, questions) {
      if (err){
        done(new Error('Error while getting user"s questions'))
      }
      done(null, questions);
    })
  },
  getAllQuestions: function (done) {
    Question.find(null,function (err, questions) {
      if (err){
        done(new Error('Error while getting all questions'))
      }
      done(null, questions);
    })
  },
  addAnswer: function (questionId, answer, authorId, isVoteUp, done) {
    var newAnswer = new Answer();
    newAnswer.questionId = questionId;
    newAnswer.answer = answer;
    newAnswer.authorId = authorId;
    newAnswer.isVoteUp = isVoteUp || 0;
    newAnswer.save(function (err) {
      if (err){
        done(new Error('Error while adding answer'))
      }
      console.log('Answer successfully added');
      done(null, newAnswer);
    })
  },
  getQuestionAnswers: function (questionId, done) {
    Answer.find({questionId: questionId},function (err, answers) {
      if (err){
        done(new Error('Error while getting questin"s answers'))
      }
      done(null, answers);
    })
  },
  findUserById: function (userId, done) {
    User.findOne({_id: userId}, function (err, user) {
      if (err){
        done( new Error("Error while looking for user with that Id"))
      }
      done(null, user)
    })
  },
  deleteQuestion: function (questionId,done) {
    Question.findByIdAndRemove(questionId, function (err, question) {
      if(err){
        done(err);
      }
      Answer.remove({questionId:questionId},function (err, obj) {
        if (err){
          done(err,question);
        }
        done(null, question);
      })

    })
  },
  isQuestionOwner: function (ownerId, questionId, done) {
    Question.findOne({_id:questionId},function (err,question) {
      if(err){
        done(err)
      }
      if (ownerId == question.authorId){
        done(null, true)
      } else {
        done(null, false)
      }
    })
  }
}