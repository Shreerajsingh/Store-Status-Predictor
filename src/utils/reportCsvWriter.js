const fs = require("fs");
const fastCsv = require("fast-csv");



const fileExists = fs.existsSync(csvFilePath);

const headers = [
    "store_id",
    "uptime_last_hour",
    "uptime_last_day",
    "uptime_last_week",
    "downtime_last_hour",
    "downtime_last_day",
    "downtime_last_week"
];



function appendStoreData(storeDataRow) {
    const formattedRow = {
        store_id: storeDataRow.store_id,
        uptime_last_hour: storeDataRow.LHU,
        uptime_last_day: storeDataRow.LDU,
        uptime_last_week: storeDataRow.LWU,
        downtime_last_hour: storeDataRow.LHD,
        downtime_last_day: storeDataRow.LDD,
        downtime_last_week: storeDataRow.LWD
    };

    const stream = fs.createWriteStream(csvFilePath, { flags: "a" });

    fastCsv
        .write([formattedRow], { headers: false })
        .pipe(stream)
        .on("finish", () => console.log("Row added:", formattedRow));
}

async function createFile(filePath) {
    try {
        await fs.writeFileSync(filePath, headers.join(",") + "\n");

        

        return `${filePath}`;
    } catch (error) {
        
    }
}

async function appendData(filePath, dataRow){
    try {
        const fileExists = fs.existsSync(filePath);

        if (!fileExists) {
            await createFile(filePath);
        }

        const newRow = {
            store_id: dataRow.store_id,
            uptime_last_hour: dataRow.LHU,
            uptime_last_day: dataRow.LDU,
            uptime_last_week: dataRow.LWU,
            downtime_last_hour: dataRow.LHD,
            downtime_last_day: dataRow.LDD,
            downtime_last_week: dataRow.LWD
        };
    
        const stream = fs.createWriteStream(filePath, { flags: "a" });
    
        fastCsv
            .write([newRow], { headers: false })
            .pipe(stream)
            .on("finish", () => console.log("Row added:", newRow));

    } catch (error) {
        
    }
}

appendStoreData({ store_id: "1234", LWU: 100, LWD: 50, LDU: 200, LDD: 30, LHU: 10, LHD: 5 });
appendStoreData({ store_id: "5678", LWU: 120, LWD: 60, LDU: 180, LDD: 25, LHU: 8, LHD: 6 });

