const https = require('https');
const fs = require('fs');
const ImportStream = require("./ImportStream");
const OptimizeStream = require("./OptimizeStream");

const BULK_DATA_URI = "https://api.scryfall.com/bulk-data";

/** Get Oracle Database Info
 * 
 * @returns {Promise<any>}
 */
function getOracleDatabaseInfo(){
    return new Promise((resolve, reject)=>{

        https.get(BULK_DATA_URI, (response)=>{
            let buffer = "";

            response.on("data", data =>{
                buffer += data.toString();
            });

            response.on("error", e =>{
                reject(e);
            })

            response.on("close", ()=>{
                try {
                    let json = JSON.parse(buffer);
                    json.data.forEach(obj=>{
                        if(obj.type === "oracle_cards")
                            resolve(obj);
                    });

                    reject(new Error("Unable to find Oracle Cards!"));
                } catch(e){
                    reject(e);
                }
            });
        });
    });
};

/** Check For Update
 * 
 * @param {string} lastUpdate 
 * @returns {Promise<any|undefined>} - update infomration.
 */
function checkForUpdate(lastUpdate){
    return new Promise((resolve, reject)=>{
        getOracleDatabaseInfo().then(data=>{
            if(new Date(data.updated_at).valueOf() > new Date(lastUpdate).valueOf())
                resolve(data);
            else
                resolve(undefined);
        }).catch(reject)
    });
}

/** Get File Metadata
 * 
 * @param {string} filename 
 * @returns {string} - date information.
 */
function getDatabaseMetadata(filename){
    return new Promise( (resolve, reject)=>{
        fs.stat(filename, (error, stats)=>{
            if(stats){
                resolve(stats.ctime.toUTCString()); 
            }

            resolve(new Date(0).toUTCString());
        });
    });
}

/** Download Update
 * 
 * @param {string} uri 
 * @param {number} size
 * @returns {Promise<string>} - temp filename
 */
function download(uri, size){
    return new Promise((resolve, reject)=>{
        const fileName = "download.json";
        const fileStream = fs.createWriteStream(fileName);

        /** Update
         * 
         * @param {number} value
         * @param {boolean} refresh
         */
        const update = (value, refresh=true) => {
            const percent = Math.round((value / size) * 1000) / 10;
            process.stdout.write(`\u001b[1AProgress: ${percent}% \n`); 
        }

        process.stdout.write('\n');
        https.get(uri, response=>{
            response.pipe(new ImportStream())
                .on("log", update)
                .on("error", reject)
            .pipe( new OptimizeStream())
                .on("log", console.log)
                .on("error", reject)
            .pipe(fileStream)
                .on("error", reject)
                .on("close", ()=>{
                    resolve(fileName);
                })
        }).on("error", reject);
    });
}

/** Update File
 * 
 * @param {string} filename 
 * @returns {Promise<void>}
 */
function update(filename){
    getDatabaseMetadata(filename).then(date=>{
        console.log(date);

        checkForUpdate(date).then(update=>{

            if(update){
                download(update.download_uri, update.size).then(newFileName=>{
                    try {
                        fs.unlinkSync(filename);
                    } catch(e){
                        //Dont care if file doesn't exist.
                    }
                    
                    fs.renameSync(newFileName, filename);
                });

            } else {
                console.log("Everything is up to date!");
            }
        });
    });
}

module.exports = update;