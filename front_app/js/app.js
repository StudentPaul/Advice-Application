/**
 * Created by socio on 12/30/2016.
 */

m.route.mode = "hash";
m.route(document.body, "/", {
  "/": main,
  "/login": login,
  "/registration": registration,
  "/add": addQuestion,
  "/allQuestions": questions
});