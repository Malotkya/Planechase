const update = require("./Scryfall/Update");

update("./cards.json").catch(e=>{
    console.error(e);
})