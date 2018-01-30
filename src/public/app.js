
angular.module('app', ['ui.router', 'ngWebSocket'])
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
        controller: 'orderCtrl',
        templateUrl: 'static/partials/order.html'        
      });
    $urlRouterProvider.otherwise('/schedule');
});
