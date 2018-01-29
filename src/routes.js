const express = require('express');
const app = module.exports = express.Router();

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