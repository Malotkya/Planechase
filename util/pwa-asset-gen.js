const pwaAssetGenerator = require("pwa-asset-generator");
const fs = require("fs");
const path = require("path");

const {expo} = require("../app.json");

//Global Variables
const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");
const MANIFEST_FILE = path.join(PUBLIC_DIRECTORY, "manifest.json");
const INDEX_FILE = path.join(PUBLIC_DIRECTORY, "index.html");

//Manifest Variables
const {categories, description, display, name, slug, lang = "en"} = expo;
const  background_color = expo.web.background_color || expo.background_color || expo.splash.background_color;
const orientation = expo.web.orientation || expo.orientation;
const start_url = expo.web.start_url || expo.start_url
const short_name = expo.short_name || name;

/* TODO: add related_applications
related_applications": [
    {
      "platform": "play",
      "url": "http://play.google.com/store/apps/details?id=com.zim563.Planechase",
      "id": "com.zim563.Planechase"
    }
  ],
  "prefer_related_applications": true,
*/


(async()=>{

    //Create Directory
    fs.mkdirSync(PUBLIC_DIRECTORY, {recursive: true});

    //Generate Starting Files
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify({background_color,  categories, description, display, lang, name, slug, start_url, short_name, orientation}));
    fs.copyFileSync(path.join(process.cwd(), "assets", "index.html"), INDEX_FILE);

    //Generate Splash Screen
    if(expo.splash){
        await pwaAssetGenerator.generateImages(
            path.resolve(process.cwd(), expo.splash.image),
            path.join(PUBLIC_DIRECTORY, "splash"), 
            {
                scrape: false,
                background: background_color,
                manifest: MANIFEST_FILE,
                index: INDEX_FILE,
                splashOnly: true
            }
        );
    }
    
    //Generate Icons
    if(expo.web.favicon){
        await pwaAssetGenerator.generateImages(
            path.resolve(process.cwd(), expo.web.favicon),
            PUBLIC_DIRECTORY,
            {
                scrape: false,
                background: background_color,
                manifest: MANIFEST_FILE,
                index: INDEX_FILE,
                favicon: true,
                iconOnly: true,
            }
        )
    }
})();


