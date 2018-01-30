
angular.module('app', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    /**
     * App routes
     */
    $stateProvider
      .state('schedule', {
        url: '/schedule',
        controller: 'scheduleCtrl'
      })
      .state('order', {
        url: '/order',
        controller: 'orderCtrl'
      });
    $urlRouterProvider.otherwise('/schedule');
});
