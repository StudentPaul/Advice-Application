/**
 * Created by socio on 12/25/2016.
 */


var validator = require('validator');

var bCrypt = require('bcrypt-nodejs');
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
module.exports = function (User, Question, Answer) {
  return{
    findOrCreateUser : function(req, done){

      if(!validator.isEmail(req.param('email').toString())){
        return done(new Error('email is not valid'))
      }
      if(!validator.isAlphanumeric(req.param('password').toString())){
        return done(new Error('Password should contain only letters and numbers'))
      }
      if(!validator.isAlphanumeric(req.param('username').toString())){
        return done(new Error('Username should contain only letters and numbers'))
      }
      if(!(req.param('username').length>2 && req.param('username').length<13)){
        return done(new Error('Username length must be from 3 to 12 chars'));
      }
      if(!(req.param('password').length>2 && req.param('password').length<13)){
        return done(new Error('Password length must be from 3 to 12 chars'));
      }
      User.findOne({ 'username' :  req.param('username') }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
          //console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
         // console.log('User already exists with username: '+req.param('username'));
          return done(new Error('user already exists'), false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.username = req.param('username');
          newUser.password = createHash(req.param('password'));
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // save the user
          newUser.save(function(err) {
            if (err){
              //console.log('Error in Saving user: '+err);
              return done(err) ;
            }
            //console.log('User Registration succesful WITH ID='+newUser._id);
            return done(null, newUser);
          });
        }
      });
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
      if(!(title.length>0 && title.length<64)){
        return done(new Error('Title length must be less than 64 and not blank'));
      }
      if(!(question.length>0 && question.length<256)){
        return done(new Error('Question length must be less than 256 and not blank'));
      }
      var newQuestion = new Question();
      newQuestion.title = title;
      newQuestion.question = question;
      newQuestion.authorId = authId;
      newQuestion.date = Date.now();
      newQuestion.votesUp = 0;
      newQuestion.votesDown = 0;
      newQuestion.save(function (err) {
        if (err){
          return done(err)
        }
        //console.log('Question successfully added');
        return done(null, newQuestion);
      })
    },
    getUserQuestions: function (userId, done) {
      Question.find({authorId: userId},function (err, questions) {
        if (err){
          return done(new Error('Error while getting user"s questions'))
        }
        return done(null, questions);
      })
    },
    getAllQuestions: function (done) {
      Question.find(null,function (err, questions) {
        if (err){
          return done(new Error('Error while getting all questions'))
        }
        return done(null, questions);
      })
    },
    addAnswer: function (questionId, answer, authorId, isVoteUp, done) {
      if(answer.length >256){
        return done(new Error('Answer length should be shorter than 256 chars'))
      }
      var newAnswer = new Answer();
      newAnswer.questionId = questionId;
      newAnswer.answer = answer;
      newAnswer.authorId = authorId;
      newAnswer.isVoteUp = isVoteUp || 0;
      newAnswer.save(function (err) {
        if (err){
          return done(err)
        }
        //console.log('Answer successfully added');
        return done(null, newAnswer);
      })
    },
    getQuestionAnswers: function (questionId, done) {
      Answer.find({questionId: questionId},function (err, answers) {
        if (err){
          return done(new Error('Error while getting questin"s answers'))
        }
        return done(null, answers);
      })
    },
    findUserById: function (userId, done) {
      User.findOne({_id: userId}, function (err, user) {
        if (err){
          return done( new Error("Error while looking for user with that Id"))
        }
        return done(null, user)
      })
    },
    deleteQuestion: function (questionId, done) {
      Question.findByIdAndRemove(questionId, function (err, question) {
        if(err){
          return done(err);
        }
        Answer.remove( {questionId : questionId} , function (err, obj) {
          if (err){
            return done(err, question);
          }
          return done(null, question);
        })

      })
    },
    isQuestionOwner: function (ownerId, questionId, done) {
      Question.findOne({_id:questionId},function (err,question) {
        if(err) {
          return done(err)
        }
        if (ownerId == question.authorId) {
          return done(null, true)
        } else {
          return done(null, false)
        }
      })
    }
  }
}