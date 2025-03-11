const { DateTime, Interval } = require("luxon");
const { loadFiles } = require('../utils/dataFilesLoader');
const { defalutTimeZone, defaultBusinessHours } = require('../utils/defaultData');

const { Report } = require('../models');
const { report_status } = require('../models');

const CrudRepository = require('../repositories/crud-repository');
const reportRepo = new CrudRepository( Report );
const reportStatusRepo = new CrudRepository( report_status );

async function generateReport(id, reportID) {
    try {
        console.log(55, reportID);
        
        helper1(reportID)

        await reportStatusRepo.update(id, {reportID: reportID, status: 'Complete'});
    } catch (error) {
        console.error(error);
    }
}

async function helper1(reportId) {
    const { Business_Hours, Store_Status, Timezones } = await loadFiles();

        for (const row of Timezones) {
            const store_id = row.store_id;
            const timezone = row.timezone_str || defalutTimeZone.timeZone;

            helper(store_id, reportId, timezone, Store_Status, Business_Hours);
        }
}

async function helper(store_id, reportId, timezone, Store_Status, Business_Hours) {
    try {
        const businessHourData = Business_Hours.filter(data => data.store_id === store_id) || (() => {
            const data = [];
            for (let i = 0; i < 7; i++) {
                const temp = { dayOfWeek: `${i}`, ...defaultBusinessHours };
                data.push(temp);
            }
            return data;
        })();

        const storeStatusData = Store_Status.filter(data => data.store_id === store_id);
        storeStatusData.forEach(date => {
            const local = DateTime.fromSQL(date.timestamp_utc, { zone: "utc" });
            date.timestamp_lc = local.setZone(timezone);
        });

        businessHourData.sort((a, b) => parseInt(a.dayOfWeek) - parseInt(b.dayOfWeek));
        storeStatusData.sort((a, b) => a.timestamp_lc - b.timestamp_lc);

        let LWU = 0, LWD = 0, LDU = 0, LDD = 0, LHU = 0, LHD = 0;

        for (const row of businessHourData) {
            const day = parseInt(row.dayOfWeek);
            const startT = DateTime.fromSQL(row.start_time_local, { zone: timezone });
            const endT = DateTime.fromSQL(row.end_time_local, { zone: timezone });

            const logs = storeStatusData.filter(log => log.timestamp_lc.weekday === day);

            if (logs.length === 0) continue;

            let uptime = 0, downtime = 0;

            for (let i = 0; i < logs.length - 1; i++) {
                const start = logs[i].timestamp_lc;
                const end = logs[i + 1].timestamp_lc;
                const status = logs[i].status;

                const startTime = start.toFormat("HH:mm");
                const endTime = end.toFormat("HH:mm");
                const businessStart = startT.toFormat("HH:mm");
                const businessEnd = endT.toFormat("HH:mm");

                let isStartInBusinessHours, isEndInBusinessHours;

                if (businessStart < businessEnd) {
                    isStartInBusinessHours = startTime >= businessStart && startTime <= businessEnd;
                    isEndInBusinessHours = endTime >= businessStart && endTime <= businessEnd;
                } else {
                    isStartInBusinessHours = startTime >= businessStart || startTime <= businessEnd;
                    isEndInBusinessHours = endTime >= businessStart || endTime <= businessEnd;
                }

                if (isStartInBusinessHours && isEndInBusinessHours) {
                    const midpoint = start.plus({ minutes: end.diff(start, "minutes") / 2 });
                    const firstHalfDuration = Math.abs(midpoint.diff(start, "minutes").minutes);
                    const secondHalfDuration = Math.abs(end.diff(midpoint, "minutes").minutes);

                    if (status === "active") {
                        uptime += firstHalfDuration;
                    } else {
                        downtime += firstHalfDuration;
                    }

                    const nextStatus = logs[i + 1].status;
                    if (nextStatus === "active") {
                        uptime += secondHalfDuration;
                    } else {
                        downtime += secondHalfDuration;
                    }
                }

                LWU += uptime;
                LWD += downtime;
                LDU = uptime;
                LDD = downtime;
            }


            const lastTimestamp = logs[logs.length - 1].timestamp_lc;
            const prevTimestamp = logs.length > 1 ? logs[logs.length - 2].timestamp_lc : null;
            const lastHourStart = endT.minus({ hours: 1 });

            if (lastTimestamp.diff(endT, "hours").hours > 1) {
                if (logs[logs.length - 1].status === "active") {
                    LHU = 60;
                    LHD = 0;
                } else {
                    LHU = 0;
                    LHD = 60;
                }
            } else {
                if (prevTimestamp && prevTimestamp >= lastHourStart) {
                    const midpoint = prevTimestamp.plus({ minutes: lastTimestamp.diff(prevTimestamp, "minutes") / 2 });
                    const firstHalf = midpoint.diff(prevTimestamp, "minutes").minutes;
                    const secondHalf = lastTimestamp.diff(midpoint, "minutes").minutes;

                    if (logs[logs.length - 2].status === "active") {
                        LHU += firstHalf;
                    } else {
                        LHD += firstHalf;
                    }

                    if (logs[logs.length - 1].status === "active") {
                        LHU += secondHalf;
                    } else {
                        LHD += secondHalf;
                    }
                } else {
                    const totalDuration = endT.diff(lastHourStart, "minutes").minutes;
                    if (logs[logs.length - 1].status === "active") {
                        LHU = totalDuration;
                        LHD = 0;
                    } else {
                        LHU = 0;
                        LHD = totalDuration;
                    }
                }
            }
        }

        const result = {
            report_name: `${reportId}`,
            store_id: store_id,
            uptime_last_hour: `${LHU}`,
            uptime_last_day: `${LDU}`,
            update_last_week: `${LWU}`,
            downtime_last_hour: `${LHD}`,
            downtime_last_day: `${LDD}`,
            downtime_last_week:`${LWD}`
        };
        // console.log(result);
        // console.log(typeof result.report_name);

        // console.log(result);
        const y = await reportRepo.getAll();
        console.log(y);
        const x = await reportRepo.create(result);
        console.log(x);
        // console.log(result);
    } catch (error) {
        console.log( error);
    }
}

async function getReport(reportId) {
    try {
        const response = reportRepo.get(reportId);

        if(response.status == 'Running') {
            return { status: 'Running' }
        }

        
    } catch (error) {
        
    }
}

module.exports = {
    generateReport,
    getReport
}