const express = require('express');
const { generateReport, getReport } = require('../controllers/reportController');

const Router = express.Router();

Router.post('/trigger_report', generateReport);
Router.get('/get_report/:id', getReport);

module.exports = Router;