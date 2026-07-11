const fs = require("fs");
const path = require("path");

function listFiles(folderName) {

    const fullPath = path.join(process.cwd(), folderName);

    if (!fs.existsSync(fullPath))
        return "Folder tidak ditemukan.";

    return fs.readdirSync(fullPath);

}

module.exports = { listFiles };