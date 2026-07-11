const fs = require("fs");
const path = require("path");

function createFile(fileName, content, intentPath) {

    const fullPath = intentPath ? path.join(process.cwd(), intentPath, fileName) : path.join(process.cwd(), fileName);

    fs.writeFileSync(fullPath, content, "utf8");

    return `File berhasil dibuat: ${fileName}`;

}

module.exports = {
    createFile
};