const fs = require("fs");
const path = require("path");

function deleteFile(fileName) {

    const fullPath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(fullPath))
        return "File tidak ditemukan.";

    fs.unlinkSync(fullPath);

    return `File ${fileName} berhasil dihapus.`;

}

module.exports = { deleteFile };