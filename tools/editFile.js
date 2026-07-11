const fs = require("fs");
const path = require("path");

function editFile(fileName, content) {
    content = content.replace(/^```(?:javascript)?\n?/i, "").replace(/\n?```$/, "");
    const fullPath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(fullPath))
        return "File tidak ditemukan.";

    fs.writeFileSync(fullPath, content, "utf8");

    return `File ${fileName} berhasil diupdate.`;

}

module.exports = { editFile };