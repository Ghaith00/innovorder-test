angular.module('app')
.controller('scheduleCtrl', ['$scope', '$http', function ($scope, $http) {
      /**
     * Models
     */
    $scope.scheduleSet;
    $scope.selectedRow;
    $scope.selectedDay;
    $scope.idNumber = 0;
    $scope.error = {'message' : '', 'title' : ''};

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

    const resetScheduleSet = ()=>{
      $scope.scheduleSet = {'MON' : {'name' : 'Monday', 'times' : []},
                            'TUE' : {'name' : 'Tuesday', 'times' : []},
                            'WED' : {'name' : 'Wednesday', 'times' : []},
                            'THU' : {'name' : 'Thursday', 'times' : []},
                            'FRI' : {'name' : 'Friday', 'times' : []},
                            'SAT' : {'name' : 'Saturday', 'times' : []},
                            'SUN' : {'name' : 'Sunday', 'times' : []}};
    }
    /**
     * Update schedule
     */
    $scope.updateSchedule = async () =>{
      // prepare data
      let data = {'scheduleSet' : []};
      for (let day in $scope.scheduleSet){
        $scope.scheduleSet[day].times.forEach((schedule)=>{
          data.scheduleSet.push({'day' : day, 'start' : schedule.startM, 'end' : schedule.endM});
        });
      }
      let response = await $http.put('/api/schedule', data);
      $scope.getSchedule();
      if(!response.data.update){
        $scope.error.title = 'Couldn\'t update the schedule!';
        $scope.error.message = response.data.message ;
        $('#error').modal('show');
      }
    };
    /**
     * Get schedule
     */
    $scope.getSchedule = async () =>{
      resetScheduleSet();
      let response = await $http.get('/api/schedule');
      if(response.status == 200){
        response.data.forEach((schedule)=>{
          // format data
          let object = {
            'id' : schedule._id,
            'start' : $scope.formatTime(schedule.start),
            'end' : $scope.formatTime(schedule.end),
            'startM' : schedule.start,
            'endM' : schedule.end
          }
          $scope.scheduleSet[schedule.day].times.push(object);
        });
        $scope.$digest();
      } else {
        $scope.error.title = 'Error status ' + response.status;
        $scope.error.message = 'Couldn\'t get the schedule!';
        $('#error').modal('show');
      }
    };
    /**
     * Delete all schedule
     */
    $scope.deleteSchedule = async () =>{
      let response = await $http.delete('/api/schedule');
      if(response.status == 200 || response.data.delete){
        $scope.getSchedule();
      } else {
        $scope.error.title = 'Error status ' + response.status;
        $scope.error.message = 'Couldn\'t delete the schedule!';
        $('#error').modal('show');
      }
    };
    /**
     * Delete schedule row
     */
    $scope.deleteRow = () =>{
      var i, day, id;
      id = $scope.selectedRow;
      day = $scope.selectedDay;
      for(i = 0; i < $scope.scheduleSet[day].times.length; i++){
        if($scope.scheduleSet[day].times[i].id == id) break;
      }
      $scope.scheduleSet[day].times.pop(i);
    };
    /**
     * Add schedule row
     */
    $scope.addRow = () =>{
      if ($scope.start != null && $scope.end != null){
        $scope.scheduleSet[$scope.selectedDay].times.push({
          'id' : $scope.idNumber,
          'day' : $scope.selectedDay,
          'start' : $scope.formatTime($scope.start),
          'end' : $scope.formatTime($scope.end),
          'startM' : $scope.start,
          'endM' : $scope.end
        });
        $scope.idNumber ++;
      } else {
        // pop error
        $scope.error.title = 'Data not valid';
        $scope.error.message = 'The start or/and end values are not valid';
        $('#error').modal('show');
      }

    };
    /**
     * Update schedule row
     */
    $scope.updateRow = () =>{

      if ($scope.start != null && $scope.end != null){
        for(let i= 0; i< $scope.scheduleSet[$scope.selectedDay].times.length; i++){
          if($scope.scheduleSet[$scope.selectedDay].times[i].id == $scope.selectedRow){
            $scope.scheduleSet[$scope.selectedDay].times[i].start = $scope.formatTime($scope.start);
            $scope.scheduleSet[$scope.selectedDay].times[i].end = $scope.formatTime($scope.end);
            $scope.scheduleSet[$scope.selectedDay].times[i].startM = $scope.start;
            $scope.scheduleSet[$scope.selectedDay].times[i].endM = $scope.end;
          }
        }
      } else {
        // pop error
        $scope.error.title = 'Data not valid';
        $scope.error.message = 'The start or/and end values are not valid';
        $('#error').modal('show');
      }
    };
    /**
     * Selected row
     */
    $scope.select = (id, day)=>{
      $scope.selectedRow = id;
      $scope.selectedDay = day;
      //update
      if (id != -1){
        let index;
        $scope.scheduleSet[day].times.forEach((schedule)=>{
          if(schedule.id == id) {
            $scope.start = schedule.startM;
            $scope.end = schedule.endM;
          }
        });
      } else {
        $scope.start = NaN;
        $scope.end = NaN;
      }
    }
    /**
     * Code
     */
    resetScheduleSet();
    $scope.getSchedule();
}]);