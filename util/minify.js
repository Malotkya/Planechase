const fs = require("fs");
const path = require("path");

/** Minify Directory
 * 
 * @param {string} dir 
 */
function minify(dir){
    for(const name of fs.readdirSync(dir)) {
        const file = path.join(dir, name);

        if(fs.statSync(file).isDirectory()){
            minify(file);
        } else if(file.indexOf(".html") > 0 || file.indexOf(".js") > 0) {
            const buffer = fs.readFileSync(file).toString();
            fs.writeFileSync(file, buffer.replaceAll(/\s+/g, " "));
            console.log(file);
        }
    }
}

minify(path.join(process.cwd(), "dist"));
