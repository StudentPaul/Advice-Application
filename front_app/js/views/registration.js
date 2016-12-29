/**
 * Created by socio on 12/30/2016.
 */

registration.view = function () {
  return [
    header(),
    m("form",{class:'form-signin', action:'/signup', method:'POST'},[
      m("input",{type : "text", name : 'username', class: "form-control nomargin", placeholder:'Username',required:"true",autofocus:"true"}),
      m("br"),
      m("input",{type:'password', name:'password', class:'form-control nomargin', placeholder:'Password', required:"true"}),
      m("br"),
      m("input", {type:'email', name:'email', class:'form-control', placeholder:'Email',required:"true"}),
      m("br"),
      m("input",{type:'text', name:'firstName', class:'form-control', placeholder:'First Name',required:"true"}),
      m("br"),
      m("input",{type:'text', name:'lastName', class:'form-control', placeholder:'Last Name',required:"true"}),
      m("br"),
      m("button",{class:'btn btn-lg btn-primary btn-block', type:'submit'},"Register")
    ])
  ]
};