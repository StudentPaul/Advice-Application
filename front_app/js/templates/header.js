/**
 * Created by socio on 12/30/2016.
 */
function header() {
  return [
    m('#header', [
      m('i',{},'Advice'),
      m('a', {config:m.route, href:'/allQuestions'}, 'All questions'),
      m('a', {config:m.route, href:'/add'}, 'Add question'),
      m('a', {config:m.route, href:'/registration'}, 'Registration'),
      m('a', {config:m.route, href:'/login'}, 'Login'),
      m('a', {config:m.route, href:'/logout'}, 'Logout'),

    ]),
    m('hr'),
  ]
}