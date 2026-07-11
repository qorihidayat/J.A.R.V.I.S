const fs = require("fs");
const path = require("path");

function deleteFolder(folderName) {

    const fullPath = path.join(process.cwd(), folderName);

    if (!fs.existsSync(fullPath))
        return "Folder tidak ditemukan.";

    fs.rmSync(fullPath, { recursive: true, force: true });

    return `Folder ${folderName} berhasil dihapus.`;

}

module.exports = { deleteFolder };