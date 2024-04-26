const {Transform} = require('stream');

class ImportStream extends Transform {
    constructor(){
        super();
        this.buffer = "";
        this.count = 0;
    }

    /** Transform Data
     * 
     * @param {Buffer} data 
     * @param {string} encoding 
     * @param {Function} callback 
     */
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

        this.emit("log", this.count);
        callback();
    }

    /** Process Line
     * 
     * @param {string} line 
     */
    processLine(line) {
        try {
            //Remove Comma from line
            if (line[line.length - 1] == ",")
                line = line.slice(0, -1);
            this.processCard(JSON.parse(line));
        }
        catch (error) {
            if (line != "[" && line != "]")
                this.emit("log", error.message + ": " + line);
        }
    }

    /** Process Card
     * 
     * @param {any} object 
     */
    processCard(object){
        if(object.layout === "planar")
            this.push(JSON.stringify(object) + '\n');
        else if(object.name.includes("Bounty:"))
            this.push(JSON.stringify(object) + '\n');
    }
}

module.exports = ImportStream;