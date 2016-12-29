/**
 * Created by socio on 12/30/2016.
 */
var questions ={};

questions.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.list = null;
    vm.answerList = null;
    vm.listReady = false;
    vm.activeQuestion = m.prop('');
    m.request({method: "GET", url: "/getAllQuestions"}).then(function (item) {
      var toReturn = JSON.parse(item);
      vm.list= new Array(toReturn);
    })
  };
  return vm;
}());