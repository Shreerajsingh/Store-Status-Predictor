const ReportService = require('../services/reportService');

const { report_status } = require('../models');
const CrudRepository = require('../repositories/crud-repository');
const reportStatusRepo = new CrudRepository( report_status );

async function generateReport(req, res) {
    try {
        const report = await reportStatusRepo.create({status: 'Running'});
        const reportId = report.report_name;
        
        ReportService.generateReport(report.id, reportId);

        return res.status(201).json({reportId: reportId});
    } catch (error) {
        return error;
    }
}

async function getReport(req, res) {
    try {
        const reportId = req.params.id;
        const report = await ReportService.getReport(reportId);
        return res.status(201).json(report);
    } catch (error) {
        return error;
    }
}

module.exports = {
    generateReport,
    getReport
}