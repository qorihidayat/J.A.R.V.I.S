const axios = require("axios");
require("dotenv").config();
const download = require("download");


async function image(query) {

    const { data } = await axios.get(
        "https://api.pexels.com/v1/search",
        {
            headers: {
                Authorization: process.env.PEXEL_API_KEY
            },
            params: {
                query,
                per_page: 1
            }
        }
    );

    await download(
        data.photos[0].src.original,
        "./images",
        {
            filename: query+".jpg"
        }
    );
    return `Image ${query}.jpg downloaded successfully.`;
}



module.exports={
    image
};