const ScheduleSet = require('./../models/schedule-set');
const validator = require('./../validators');

/**
 * Get current schedule set
 */
const current = (request, response, next)=>{
  // Call back
  const callback = (error, schedule)=>{
    if (schedule != null && schedule.scheduleSet != null)
      response.send(schedule.scheduleSet);
    else {
      response.send([]);
    }
  }
  // Get scheduleSet array
  ScheduleSet.findOne({}, 'scheduleSet', callback);
}


/**
 * Update current scheduleSet
 */
const update = (request, response, next)=>{
  let newScheduleSet = request.body.scheduleSet;
  let scheduleObject = new ScheduleSet();
  let returnJson = {'update' : true, 'error' : false, 'message' : ''};
  let error ;

  scheduleObject.scheduleSet = newScheduleSet;  
  
  // get validation errors if exists
  error = scheduleObject.validateSync();
  if(!error){
    // save one schedule set object 
    if (validator.coherentDates(newScheduleSet)){
        ScheduleSet.collection.drop();
        scheduleObject.save();
        response.send(returnJson);
    } else {
        returnJson.update = false; returnJson.error = true;
        returnJson.message = 'schedule set is not coherent';
        response.send(returnJson);
    }
  } else {
    // errors messages
    returnJson.update = false; returnJson.error = true;
    returnJson.message = error.errors;
    response.send(returnJson);
  }
}

/**
 * Delete current schedule set
 */
const remove = (request, response, next)=>{
  ScheduleSet.collection.drop();
  response.send({ 'delete' : true });
}


module.exports = {
    current,
    update,
    remove
 };
