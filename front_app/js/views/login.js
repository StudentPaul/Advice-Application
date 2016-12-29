/**
 * Created by socio on 12/30/2016.
 */

login.view = function () {
  return [
    header(),
    m('form',{class:'form-signin', action:'/login', method:'POST'},[
      m('input',{type:'text', name:'username', class:'form-control', placeholder:'Username',required:'true', autofocus:'true'}),
      m('input',{type:'password', name:'password', class:'form-control', placeholder:'Password',required:'true'}),
      m('button',{class:'btn btn-lg btn-primary btn-block', type:'submit'},'login')
    ])


  ]
};