const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

const business_hours_path = path.join(__dirname, '../../data_files/business_hours.csv');
const store_status_path = path.join(__dirname, '../../data_files/store_status.csv');
const timezones_path = path.join(__dirname, '../../data_files/timezones.csv');

async function readfile(filePath) {
    try {
        const data = [];
        const readStream = fs.createReadStream(filePath).pipe(csvParser());

        for await (const row of readStream) {
            data.push(row);
        }

        console.log(`CSV file successfully processed, path = ${filePath}`);

        return data;
    } catch (error) {
        return error;
    }
}

async function loadFiles() {
    try {
        const Business_Hours = await readfile(business_hours_path);
        const Store_Status = await readfile(store_status_path);
        const Timezones = await readfile(timezones_path);

        return {
            Business_Hours,
            Store_Status,
            Timezones
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadFiles
}