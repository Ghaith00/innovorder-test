const express = require('express');
const app = module.exports = express.Router();
const scheduleController = require('./controllers/schedule');
const orderController = require('./controllers/order');

/**
 * GET /api/test
 * Example
 */
 app.get('/test', (request, response)=>{
   response.json('hello');
});

/**
 * GET /api/schedule
 * View current schedule set
 */
app.get('/schedule', scheduleController.current);

/**
 * PUT /api/schedule
 * Update schedule
 */
app.put('/schedule', scheduleController.update);

/**
 * DELETE /api/schedule
 * Delete the current schedule
 */
app.delete('/schedule', scheduleController.remove);

/**
* GET /api/order
* View all orders
*/
app.get('/order', orderController.list);


/**
* POST /api/order
* Create an order
*/
app.post('/order', orderController.create);

/**
* PUT /api/order
* Update an order
*/
app.put('/order', orderController.update);

/**
 * GET /api/next
 * get next Available Ordering Date
 */
app.get('/next', orderController.nextAvailableOrderDate);
