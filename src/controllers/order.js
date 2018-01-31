const Orders = require('./../models/order');
const validator = require('./../validators')
const socket = require('./../socket');
const ScheduleSet = require('./../models/schedule-set');

/**
 * constant variables
 */

const daysCode = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Get previous available ordering date
 */
const getOldDate = async () => {
  // find the latest order
  const order = await Orders.findOne().sort('-createdAt').exec();
  // if order is null
  if(order == null) return -1;

  // return available order date(time)
  return order.nextAvailableDate;
};
/**
 * return next shift if exist
 */
const getNextShift = async (day, time)=>{
  let nextShift = null ;
  let previousEnd = Infinity;
  const cTime = time + daysCode.indexOf(day) * 1440;
  // get schedules
  const schedules = await ScheduleSet.findOne().exec();
  // search
  schedules.scheduleSet.forEach((shift)=>{
    let start = shift.start + daysCode.indexOf(shift.day) * 1440;
    let end = shift.end + daysCode.indexOf(shift.day) * 1440;
    if ( start > cTime &&  previousEnd < cTime )
      nextShift = shift;
    previousEnd = end;
  });
  return nextShift;
};
/**
 * round a number to modulo 15
 */
const round15 = (number) => {
  return Math.ceil(number / 15 )*15 ;
};

/**
 * get current day code
 */
const getCurrentDayCode = ()=>{
  const now = new Date(Date.now());
  return daysCode[now.getDay()];
}
/**
 * compute next available ordering date
 */
const computeNextDate = async(order) => {

  const day = getCurrentDayCode();
  let now = new Date(Date.now());
  // get current date in minutes
  now = round15(now.getMinutes() + now.getHours() * 60);
  // get last order date
  const oldDate = await getOldDate();
  // if the restaurent is time free else add to previous order
  if (now > oldDate.time && daysCode.indexOf(day) > daysCode.indexOf(oldDate.day) || oldDate == -1){
    // compute next available ordring date
    let res = now + round15(order.preparationDelay) + round15(order.rushDelay);
    if ( await validator.inSchedule(day, now, res)) {
      return { 'time' : res, 'day' : day } ;
    } else {
      return null;
    }
  } else {
    // compute next available ordring date after previous order
    let res = oldDate.time + round15(order.preparationDelay) + round15(order.rushDelay);
    if ( await validator.inSchedule(day, oldDate.time, res)) {
      return { 'time' : res, 'day' : day };
    } else {
      return null;
    }
  };
};

/**
 * Get all orders controller
 */
const list = (request, response, next) => {
    // Call back
    const callback = (error, orders) => {
        if (orders != null) {
            response.send(orders);
        } else {
            response.send([]);
        }
    }
    // Get orders array
    Orders.find({}, callback);
}

/**
 * create an order controller
 */
const create = async (request, response) => {
  try {
    let order = request.body;
    if( order == null){
      response.status(400).json({
        message : 'Error when creating the order',
        error : 'Order is empty'
      });
      return
    }
    const nextDate = await computeNextDate(order);
    // if it's a valid ordering time(in schedule)
    if(nextDate != null){
      order.createdAt = new Date(Date.now());
      order.nextAvailableDate = {
        day : nextDate.day,
        time :  nextDate.time
      }
      Orders.create(
        // the new object (order)
        order,
        async (error, order) => {
          if (error) {
            response.status(400).json({
              message : 'Error when creating the order',
              error : error
            });
          } else{
            socket.sendToAll(await getOldDate());
            response.status(201).json(order);
          }

        },
      );
    } else {
      response.status(400).json({
        message : 'Error when creating the order',
        error : 'Can\'t Order Now, no shift today!'
      });
    }

  } catch (e) {
    console.log(`[!] create on ${e}`);
    response.status(403).json({
      message : 'Error when creating the order',
      error : e
    });
  }
};

/**
 * Update an order controller (not valid)
 */
const update = (request, response) => {
  const order = request.body.order;
  order.createdAt = Date.now();
  Orders.update(
    // get the id from the body
    {_id: order._id },
    order,
    // callback function
    (error, order) => {
      if (error)
          response.status(403).send({ error : error });
      else
          response.send({ order : order });
  });
};
/**
 * Get the next available ordering date
 */
const nextAvailableOrderDate = async (request, response)=>{
  const date = await getOldDate();

  // get current date to choose it with the old one
  let now = new Date(Date.now());
  now = round15(now.getMinutes() + now.getHours() * 60);
  const day = getCurrentDayCode();
  // if not in schedule
  if(!(await validator.inSchedule(day, now, now))){
    const nextShift = await getNextShift(day, now);
    response.json({ 'day' : nextShift.day, 'time' : nextShift.start});
  }
  // send current time
  else if(now > date.time && day == date.day || date == -1){
    response.json({ 'day' : day, 'time' : now});
  } else {
    response.json(date);
  }
}

module.exports = {
    list,
    create,
    update,
    nextAvailableOrderDate,
    getOldDate
};
