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

        https.get("https://api.scryfall.com/bulk-data", (response)=>{
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
        })
    });
};

/** Check For Update
 * 
 * @param {string} lastUpdate 
 * @returns {Promise<any|undefined>} - update infomration.
 */
async function checkForUpdate(lastUpdate){
    let data = await getOracleDatabaseInfo();

    if(new Date(data.updated_at).valueOf() > new Date(lastUpdate).valueOf())
        return data;

    return undefined;
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
 * @returns {Promise<string>} - temp filename
 */
function download(uri){
    return new Promise((resolve, reject)=>{
        const fileName = "download.json";
        const fileStream = fs.createWriteStream(fileName);

        https.get(uri, response=>{
            response.pipe(new ImportStream())
                .on("log", console.log)
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
async function update(filename){
    const date = await getDatabaseMetadata(filename);
    console.log(date);
    const update = await checkForUpdate(date);

    if(update){
        console.log(update.size);
        const newFile = await download(update.download_uri);
        try {
            fs.unlinkSync(filename);
        } catch(e){
            //Dont care if file doesn't exist.
        }
        
        fs.renameSync(newFile, filename);
    } else {
        console.log("Everything is up to date!");
    }
}

module.exports = update;