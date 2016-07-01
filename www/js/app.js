
angular.module('todo', ['ionic', 'todo.services', 'todo.controllers'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.config(function($stateProvider, $urlRouterProvider) {
  
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
  
    .state('home', {
      url: '/',
      templateUrl: 'templates/todo-list.html',
      controller: 'TodoCtrl'
        });
  
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
  
  });