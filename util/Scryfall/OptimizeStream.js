const {Transform} = require('stream');

const PLANE = "Plane";
const PHENOMENON = "Phenomenon";
const BOUNTY = "Card";

/** Push value
 * 
 * Checks to make sure the object has an array at the
 * name, and then pushes the value onto the array.
 * 
 * @param {Object} object 
 * @param {string} name 
 * @param {any} value 
 */
function push(object, name, value){
    if( !Array.isArray(object[name]) ){
        object[name] = [];
    }

    object[name].push(value);
}

/** Clean Arrays and Sort
 * 
 * @param {Object} object 
 * @returns {Object}
 */
function clean(object){
    for(let name in object){
        if(!Array.isArray(object[name]) || object[name].length === 0) {
            delete object[name];
        } else {
            object[name].sort((a,b)=>a.name.localeCompare(b.name));
        }
    }

    return object;
}

class OptimizeStream extends Transform {
    constructor(){
        super();
        this.planechase = {};
        this.planechase[PLANE] = {};
        this.planechase[PHENOMENON] = {};
        this.bounty = {};
        this.unknown = {};
        this.buffer = "";
    }

    /** Transform Data
     * 
     * @param {Buffer} data 
     * @param {string} encoding 
     * @param {Function} callback 
     */
    _transform(data, encoding, callback){
        this.buffer += data.toString();
        let index = this.buffer.indexOf('\n');

        while (index >= 0) {
            if (index != 0) {
                this.processLine(this.buffer.slice(0, index).trim());
                this.buffer = this.buffer.slice(index + 1);
            }
            else {
                this.buffer = this.buffer.slice(1);
            }
            index = this.buffer.indexOf('\n');
        }
        callback();
    }

    /** Flush Data
     * 
     * @param {Function} callback 
     */
    _flush(callback){
        const Planechase = [
            {
                name: "Plane",
                value: clean(this.planechase[PLANE])
            },
            {
                name: "Phenomenon",
                value: clean(this.planechase[PHENOMENON])
            }
        ];

        const Bounty = {
            name: "Bounty",
            value: clean(this.bounty)
        };

        const Unknown = clean(this.unknown);

        this.push(JSON.stringify({Planechase, Bounty, Unknown}, null, 2));
        callback();
    }

    /** Process Line
     * 
     * @param {string} line 
     */
    processLine(line){
        let object = JSON.parse(line);
        const set = object.set_name || UNKNOWN;

        if(Array.isArray(object.card_faces))
            object = object.card_faces[0];

        if(object.image_uris){
            let temp = {
                name: object.name,
                text: object.oracle_text,
                type: object.type_line,
                image_uri: object.image_uris.normal
            }
            
            if(temp.type.includes(PLANE)){
                push(this.planechase[PLANE], set, temp);
            } else if(temp.type.includes(PHENOMENON)){
                push(this.planechase[PHENOMENON], set, temp);
            } else if(temp.type.includes(BOUNTY)){
                push(this.bounty, set, temp);
            } else {
                push(this.unknown, set, temp);
            }
        } else {
            this.emit("error", new Error("No images found for: " + object.name));
        }
    }
}

module.exports = OptimizeStream;