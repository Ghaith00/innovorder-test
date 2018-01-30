angular.module('app')
  .controller('orderCtrl', ['$scope', '$http', function($scope, $http) {
    /**
     * Models
     */
    $scope.orders;
    $scope.nextOrderData;
    $scope.dayMap = {
      'MON' : 'Monday',
      'TUE' : 'Tuesday',
      'WED' : 'Wednesday',
      'THU' : 'Thursday',
      'FRI' : 'Friday',
      'SAT' : 'Saturday',
      'SUN' : 'Sunday'
    };
    $scope.error = {'message' : '', 'title' : ''};

    /**
     * Format date to a readble text
     * https://docs.microsoft.com/en-us/scripting/javascript/date-and-time-strings-javascript
     */
    $scope.formatDate = (time) => {
      let date = new Date(time);
      options = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
      };
      return date.toLocaleTimeString("en-us", options);
    }
    /**
     * Format minutes to proper time
     */
    $scope.formatTime  = (time) => {
      if(time == undefined || time == null || isNaN(time)) return '';
      let hours = Math.floor(time / 60);
      let minutes = time % 60;
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      let strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    /**
     * Get Orders
     */
    $scope.getOrders = async () =>{
      $scope.orders = [];
      let response = await $http.get('/api/order');
      if(response.status == 200){
        $scope.orders = response.data;
        $scope.$digest();
      } else {
        $scope.error.title = 'Error status ' + response.status;
        $scope.error.message = 'Couldn\'t get the orders!';
        $('#error').modal('show');
      }
    };
    /**
     * Get next available ordering date
     */
    $scope.getNextDate = async () => {
      let response = await $http.get('/api/next');
      if(response.status == 200){
        $scope.nextOrderData = response.data;
      } else {
        $scope.error.title = 'Error status ' + response.status;
        $scope.error.message = 'Couldn\'t get the orders!';
        $('#error').modal('show');
      }
      $scope.$digest();
    }
    /**
     * add new order
     */
    $scope.newOrder = async ()=>{
      const menu = {
        'BW' : { 'name' : 'Beef wellington', 'price' : 30, 'preparation' :35},
        'P4C' : {'name' : 'Pizza 4 cheeses', 'price' : 20, 'preparation' : 10},
        'FC' : {'name' : 'Fish couscou', 'price' : 12, 'preparation' : 15},
        'R' : {'name' : 'Risotto', 'price' : 9, 'preparation' : 10}
      }
      let data = {
        'clientName' : $scope.user,
        'preparationDelay' : menu[$scope.order].preparation,
        'content' : menu[$scope.order].name,
        'price' : menu[$scope.order].price,
        "rushDelay": $scope.additional
      }
      try {
        //
        let response = await $http.post('/api/order', data);
      } catch (e) {
        console.log(e.data);
        $scope.error.title = e.data.error;
        $scope.error.message = e.data.message;
        $('#error').modal('show');
        $scope.$digest();
      }
    };
    $scope.getOrders();
    $scope.getNextDate();

  }]);
