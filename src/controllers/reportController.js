const ReportService = require('../services/reportService');

const { report_status } = require('../models');
const CrudRepository = require('../repositories/crud-repository');
const reportStatusRepo = new CrudRepository( report_status );

async function generateReport(req, res) {
    try {
        console.log(111);
        const report = await reportStatusRepo.create({status: 'Running'});
        const reportId = report.report_name;
        console.log(84, reportId, report);
        
        ReportService.generateReport(report.id, reportId);

        return res.status().json({reportId: reportId});
    } catch (error) {
        return error;
    }
}

async function getReport(req, res) {
    try {
        const { reportId } = req.body;
        const response = await ReportService.getReport(reportId);

        return res.status().json( response );
    } catch (error) {
        return error;
    }
}

module.exports = {
    generateReport,
    getReport
}