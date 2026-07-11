const {music} = require("../tools/api/music");
const {image} = require("../tools/api/image");
const { contentParser } = require("../agent/contentParser");
const { search } = require("../tools/api/search");
async function contentRouter(query) {
    const intent = await contentParser(query);
    console.log(intent);    
    if (intent.action === "music") {
        return await music(intent.title, intent.qty);
    } else if (intent.action === "image") {
        return await image(intent.title, intent.qty);
    }else{
        return false;
    }
}

module.exports = {
    contentRouter
};