/**
 * Created by socio on 12/30/2016.
 */

questions.view = function (ctrl) {
  return[
    header(),
    m('button',{onclick: ctrl.fetchMyQuestions.bind(ctrl), class:'btn btn-lg btn-primary btn-block'},'Show only my questions'),
    m('button',{onclick:ctrl.fetchAllQuestions.bind(ctrl), class:'btn btn-lg btn-primary btn-block'},'Show all questions'),
    m("table", [
      (questions.vm.list)?questions.vm.list[0].map(function(question, index) {
        return m("div",{class:"question-block", selected: ctrl.isSelected(question)},m("tr", [
          m("h1",{},m("td", {}, question.title )),
          m("td", {}, question.question),
          m('button',{onclick: ctrl.answer.bind(ctrl,question._id), class:'btn btn-lg btn-primary btn-block'},'Select'),
          m('button',{onclick: function () {
            document.location = "/deleteQuestion/"+question._id;
          }, class:'btn btn-lg btn-primary btn-block'},'Delete')
        ]))
      }):m('div',{},'No questions found')
    ]),
    m('form',{class:'form-signin', action:'/answerQuestion', method:'POST'},[
      m('input',{onchange: m.withAttr("value", questions.vm.activeQuestion), value: questions.vm.activeQuestion(),
        type:'text', name:'questionId', class:'form-control', placeholder:'Question ID',required:'true', autofocus:'true'}),
      m('input',{type:'text', name:'answer', class:'form-control', placeholder:'Answer',required:'true', }),
      m('button',{class:'btn btn-lg btn-primary btn-block', type:'submit'},'Answer')
    ]),

    m("table", [
      (questions.vm.answerList)?questions.vm.answerList[0].map(function(answer, index) {
        return m("div",{class:"answer-block"},m("tr", [
          m("td", {}, answer.author ),
          m("td", {}, answer.answer),
          m("td", {}, answer.date),
        ]))
      }):[]
    ])
  ]

};