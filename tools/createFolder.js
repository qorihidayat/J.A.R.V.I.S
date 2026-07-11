const fs = require("fs");
const path = require("path");

function createFolder(folderName) {

    const fullPath = path.join(process.cwd(), folderName);

    if (fs.existsSync(fullPath)) {

        return "Folder sudah ada.";

    }

    fs.mkdirSync(fullPath);

    return "Folder berhasil dibuat.";

}

module.exports = {

    createFolder

};