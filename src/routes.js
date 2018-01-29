const express = require('express');
const app = module.exports = express.Router();

/**
 * GET /api/test
 * Example
 */
 app.get('/test', (request, response)=>{
   response.json('hello');
});