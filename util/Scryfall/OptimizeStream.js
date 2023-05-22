const {Transform} = require('stream');

class OptimizeStream extends Transform {
    constructor(){
        super();
        this.list = [];
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
        this.push(JSON.stringify(this.list, null, 2));
        callback();
    }

    processLine(line){
        let object = JSON.parse(line);

        if(object.image_uris){
            this.list.push({
                name: object.name,
                text: object.oracle_text,
                image_uri: object.image_uris.normal
            });
        } else {
            this.emit("error", new Error("No images found for: " + object.name));
        }
    }
}

module.exports = OptimizeStream;