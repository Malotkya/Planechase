const {Transform} = require('stream');

const PLANE = "Plane";
const PHENOMENON = "Phenomenon";
const UNKNOWN = "Unkown";

class OptimizeStream extends Transform {
    constructor(){
        super();
        this.list = {};
        this.list[PLANE] = [];
        this.list[PHENOMENON] = [];
        this.list[UNKNOWN] = [];
        this.buffer = "";
    }

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

    _flush(callback){
        for(let name in this.list){
            if(this.list[name].length === 0){
                delete this.list[name]
            } else {
                this.list[name].sort((a,b)=>a.name.localeCompare(b.name));
            }
        }
        this.list[PLANE]
        this.push(JSON.stringify(this.list, null, 2));
        callback();
    }

    processLine(line){
        let object = JSON.parse(line);

        if(object.image_uris){
            let temp = {
                name: object.name,
                text: object.oracle_text,
                type: object.type_line,
                image_uri: object.image_uris.normal
            }
            if(temp.type.includes(PLANE)){
                this.list[PLANE].push(temp);
            } else if(temp.type.includes(PHENOMENON)){
                this.list[PHENOMENON].push(temp);
            } else {
                this.list[UNKNOWN].push(temp);
            }
        } else {
            this.emit("error", new Error("No images found for: " + object.name));
        }
    }
}

module.exports = OptimizeStream;