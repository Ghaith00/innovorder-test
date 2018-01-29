const ScheduleSet = require('./models/schedule-set');
/**
 * Get sorted index
 */
const sortedIndex = (array, value) => {
  let low = 0, high = array.length;
  while (low < high) {
      let mid = (low + high) >>> 1;
      if (array[mid] < value) low = mid + 1;
      else high = mid;
  }
  return low;
}
/**
 * check if the schedule set has one date line
 */
const coherentDates = (scheduleSet) => {
  // [..., {starti, endi}, ..., {startj, endj}, ...] is coherent if starti or endi not in [startj, endj]
  let timeLine = [];
  const daysCode = ['MON', 'TUE', 'THU', 'WED', 'FRI', 'SAT', 'SUN'];
  let coherent = true;
  scheduleSet.forEach((schedule)=>{
    let start = schedule.start + daysCode.indexOf(schedule.day) * 1440;
    let end = schedule.end + daysCode.indexOf(schedule.day) * 1440;
    let startSortedIndex = sortedIndex(timeLine, start);
    let endSortedIndex = sortedIndex(timeLine, end);

    // if start or end is inside an interval => not coherent
    if ((startSortedIndex % 2) + (endSortedIndex % 2) != 0) coherent = false;
    timeLine.splice(endSortedIndex, 0, end);
    timeLine.splice(startSortedIndex, 0, start);
  });
  return coherent;
}

module.exports =  { coherentDates };
