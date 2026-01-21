const {DefinePlugin} = require("webpack");
const path = require("path");
const {version} = require("./package.json");
const {Planechase, Bounty} = require("./cards.json");

function getAllCardImages() {
    try {
        return Planechase.concat([Bounty]).flatMap((version)=>{
            let output = [];

            for(const name in version.value){
                output = output.concat(version.value[name].map((card=>{
                    return card.image_uri;
                })))
            }

            return output
        })

    } catch(e) {
        console.error(e)
        return [];
    }
}

//Directories used multiple times
const BUILD_DIR = path.resolve(__dirname, 'public');
const SRC_DIR   = path.resolve(__dirname, "service_worker");

module.exports = {
    mode: "production",
    entry: path.join(SRC_DIR, "index.ts"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    target: "webworker",
    output: {
        filename: 'sw.js',
        path: BUILD_DIR
    },
    plugins: [
        new DefinePlugin({
            VERSION: JSON.stringify(version),
            IMAGES: JSON.stringify(getAllCardImages())
        })
    ]
}