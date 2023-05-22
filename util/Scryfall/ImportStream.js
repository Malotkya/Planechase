const {Transform} = require('stream');

class ImportStream extends Transform {
    constructor(){
        super();
        this.buffer = "";
        this.count = 0;
    }

    _transform(data, encoding, callback){
        this.buffer += data.toString();
        this.count += data.length;

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

        console.log(this.count);
        callback();
    }

    processLine(line) {
        try {
            //Remove Comma from line
            if (line[line.length - 1] == ",")
                line = line.slice(0, -1);
            let object = JSON.parse(line);
            this.processCard(object);
        }
        catch (error) {
            if (line != "[" && line != "]")
                this.emit("log", error.message + ": " + line);
        }
    }

    processCard(object){
        if(object.layout === "planar")
            this.push(JSON.stringify(object) + '\n');
    }
}

module.exports = ImportStream;