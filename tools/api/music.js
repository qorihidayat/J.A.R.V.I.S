const {default: axios} = require("axios");
async function music(title, qty) {
    const response = await axios.get(`https://itunes.apple.com/search?term=${title}&entity=song&limit=${qty}`);
    let result = "";
    response.data.results.forEach((item) => {
        result += item.artistName + " - " + item.trackName;
    });
    return result;
}

module.exports = {
    music
};