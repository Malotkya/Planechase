/**
 * @typedef {import("http").IncomingMessage} Response
 */
const https = require("https");
const http = require('http');

const HOSTNAME = "api.scryfall.com";
const TIMEOUT = 50;
const FetchQueue = [];

/** Wait In Queue
 * 
 * @param {{
 * hostname: string,
 *     path: string,
 *     port: number,
 *   method: string,
 *  headers: Record<string, string>
 * }} self 
 * @returns {Promise<Response>}
 */
function waitInQueue(self){
    return new Promise(async(resolve, reject)=>{
        FetchQueue.push(self);

        while(FetchQueue[0] !== self)
            await sleep();

        await sleep(TIMEOUT);

        const req = https.request(self, (resp)=>{
            leave_queue(self);
            resolve(resp);
        });

        req.on("error", (e)=>{
            leave_queue(self);
            reject(e);
        });

        req.end();

        setTimeout(()=>{
            leave_queue(self)
            reject(new Error("Request Timmed Out!"));
        }, 30000);
    });
}

/** Leave Queue
 * 
 * @param {any} self 
 */
function leave_queue(self) {
    const index = FetchQueue.indexOf(self);
    if(index >= 0) {
        FetchQueue.splice(index, 1);
    }
}

/** Get Response Body
 * 
 * @param {Response} response 
 * @return {Promise<string>}
 */
function getBody(response) {
    return new Promise((resolve, reject)=>{
        const buffer = [];

        response.on('data', (chunk)=>{
            buffer.push(String(chunk));
        });

        response.on('error', reject);

        response.on("end", ()=>{
            try {
                resolve(buffer.join(""));
            } catch (e){
                reject(e);
            }
        });
    });
}

/** Sleep
 * 
 * @param {number} ms 
 */
function sleep(ms = 10) {
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
}

/** Format Args
 * 
 * @param {string|url} url 
 * @param {{
 *     port?: number|undefined,
 *   method?: string|undefined,
 *  headers?: Record<string, string>|undefined
 * }} opts 
 * 
 * @returns {{
 * hostname: string,
 *     path: string,
 *     port: number,
 *   method: string,
 *  headers: Record<string, string>
 * }}
 */
function formatArgs(url, opts = {}) {
    const {port = 443, method = "GET", headers = {}} = opts;
    let path;
    let hostname;

    if(url instanceof URL) {
        path = url.pathname;
        hostname = url.hostname;
    } else {
        path = String(url);
        hostname = HOSTNAME;
    }

    headers["User-Agent"] = `Node/${process.versions.node} (Web Scraper for https://mtg.malotky.net/)`;
    headers["Accept"] = "application/json";

    return {hostname, path, port, method, headers};
}

/** Fetch Scryfall
 * 
 * @param {string|url} url 
 * @param {{
 *     port?: number|undefined,
 *   method?: string|undefined,
 *  headers?: Record<string, string>|undefined
 * }} opts
 * @returns {Promise<Response&{
 *      json():Promise<any>,
 *      text():Promise<string>
 * }>}
 */
module.exports = async function fetch(url, opts = {}) {
    const self = formatArgs(url, opts);

    const response = await waitInQueue(self);
    const code = Number(response.statusCode);

    if(code === 200) {
        response.text = function() {
            return getBody(response);
        }

        response.json = async function() {
            const string = await getBody(response);
            return JSON.parse(string);
        }

        return response;
    }

    console.debug(self);

    const data = {
        statusCode: code,
    };
    const string = await getBody(response);
    try {
        Object.assign(data, JSON.parse(string))
    } catch(_) {
        data.message = http.STATUS_CODES[code];
        data.body = string;
    }

    throw data;
}