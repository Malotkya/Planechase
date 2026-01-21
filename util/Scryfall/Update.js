const fetch = require("./Fetch");
const fs = require('fs');
const ImportStream = require("./ImportStream");
const OptimizeStream = require("./OptimizeStream");

/** Get Oracle Database Info
 * 
 * @returns {Promise<{
 *       object: "bulk_data",
 *           id: string,
 *         type: "oracle_cards",
 *   updated_at: string,
 *          uri: string,
 *         name: string,
 *  description: string,
 *         size: number,
 * download_uri: string,
 * content_type: string,
 * content_encoding: string
 * }>}
 */
async function getOracleDatabaseInfo(){
    const response = await fetch("/bulk-data");
    const {data}   = await response.json();

    for(const item of data) {
        if(item.name === "Oracle Cards") {
            return item;
        }
    }

    throw new Error("Unable to find oracle cards in response!");
};

/** Check For Update
 * 
 * @param {Date} lastUpdate 
 * @returns {Promise<{
 *       object: "bulk_data",
 *           id: string,
 *         type: "oracle_cards",
 *   updated_at: string,
 *          uri: string,
 *         name: string,
 *  description: string,
 *         size: number,
 * download_uri: string,
 * content_type: string,
 * content_encoding: string
 * }|null>} - update infomration.
 */
async function checkForUpdate(lastUpdate){
    const data = await getOracleDatabaseInfo();

    if(new Date(data.updated_at).valueOf() > lastUpdate.valueOf()) {
        return data;
    } else {
        return null;
    }
}

/** Get File Metadata
 * 
 * @param {string} filename 
 * @returns {Promise<Date>} - date information.
 */
function getDatabaseMetadata(filename){
    return new Promise( (resolve, reject)=>{
        fs.stat(filename, (error, stats)=>{
            if(stats){
                resolve(stats.ctime); 
            }

            resolve(new Date(0));
        });
    });
}

/** Download Update
 * 
 * @param {URL} url
 * @param {number} size
 * @returns {Promise<string>} - temp filename
 */
function download(url, size){
    return new Promise((resolve, reject)=>{
        const fileName = "download.json";

        const close = (e) => {
            //Delete temp file on error.
            try {
                fs.unlinkSync(fileName);
            } catch (_){

            }
            reject(e);
        }

        /** Update
         * 
         * @param {number} value
         */
        const update = (value) => {
            const percent = Math.round((value / size) * 1000) / 10;
            process.stdout.write(`\u001b[1AProgress: ${percent}% \n`); 
        }

        process.stdout.write('\n');
        fetch(url).then((response)=>{
            response.pipe(new ImportStream())
                .on("log", update)
                .on("error", close)
            .pipe(new OptimizeStream())
                .on("log", console.log)
                .on("error", close)
            .pipe(fs.createWriteStream(fileName))
                .on("error", close)
                .on("close", ()=>{
                    resolve(fileName)
                });
        }).catch(close);
    });
}

/** Update File
 * 
 * @param {string} filename 
 * @returns {Promise<void>}
 */
module.exports = async function update(filename){
    const date = await getDatabaseMetadata(filename);
    console.log(date.toString());

    const update = await checkForUpdate(date);
    if(update === null) {
        console.log("Everything is up to date!");
        return;
    }

    console.log(update.download_uri);
    const tempName = await download(new URL(update.download_uri), update.size);
    try {
        fs.unlinkSync(filename);
    } catch(_){
        //Dont care if file doesn't exist.
    }

    fs.renameSync(tempName, filename);
}