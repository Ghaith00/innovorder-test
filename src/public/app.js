
angular.module('app', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    /**
     * App routes
     */
    $stateProvider
      .state('schedule', {
        url: '/schedule',
        controller: 'scheduleCtrl',
        templateUrl: 'static/partials/schedule.html'        
      })
      .state('order', {
        url: '/order',
        controller: 'orderCtrl'
      });
    $urlRouterProvider.otherwise('/schedule');
});
