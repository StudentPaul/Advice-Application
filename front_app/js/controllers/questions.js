/**
 * Created by socio on 12/30/2016.
 */
questions.controller = function () {
  questions.vm.init();
  return {
    answer: function (questionId) {
      questions.vm.activeQuestion(questionId);
      this.fetchAnswers();
    },
    fetchAnswers: function () {
      m.request({method: "GET", url: "/getQuestionAnswers/"+questions.vm.activeQuestion()}).then(function (item) {
        var toReturn = JSON.parse(item);
        questions.vm.answerList= new Array(toReturn);
      })
    },
    fetchMyQuestions: function () {
      m.request({method: "GET", url: "/getOwnQuestions"}).then(function (item) {
        var toReturn = JSON.parse(item);
        questions.vm.list= new Array(toReturn);
      })
    },
    fetchAllQuestions: function () {
      m.request({method: "GET", url: "/getAllQuestions"}).then(function (item) {
        var toReturn = JSON.parse(item);
        questions.vm.list= new Array(toReturn);
      })
    },
    isSelected: function (currentItem) {
      return (currentItem._id ===questions.vm.activeQuestion());
    }
  }
};