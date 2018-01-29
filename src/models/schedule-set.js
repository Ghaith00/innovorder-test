const mongoose = require('mongoose');

const Schedules = new mongoose.Schema({
    day : {
      type : String,
      required : true,
      enum: ['MON', 'TUE', 'THU', 'WED', 'FRI', 'SAT', 'SUN']
    },
    start : {
      type : Number,
      required : true,
      validate : { validator : (num) => { return num % 15 == 0;} }
    },
    end : {
      type : Number,
      required : true,
      validate : { validator : (num) => { return num % 15 == 0;} }
    }
});

const ScheduleSchema = new mongoose.Schema({
    scheduleSet : { type: [Schedules], index: true },
  });
const ScheduleSet = mongoose.model('schedule_set', ScheduleSchema);
module.exports = ScheduleSet;
