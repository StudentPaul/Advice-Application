/**
 * Created by socio on 12/30/2016.
 */

addQuestion.view = function () {
  return [
    header(),
    m('form',{class:'form-signin', action:'/addQuestion', method:'POST'},[
      m('input',{type:'text', name:'title', class:'form-control', placeholder:'Question title',required:'true', autofocus:'true'}),
      m('input',{type:'text', name:'question', class:'form-control', placeholder:'Your question',required:'true'}),
      m('button',{class:'btn btn-lg btn-primary btn-block', type:'submit'},'Post question')
    ])
  ]
};