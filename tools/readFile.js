const fs = require("fs");
const path = require("path");

function readFile(fileName){

    const fullPath = path.join(process.cwd(), fileName);

    if(!fs.existsSync(fullPath))
        return "File tidak ditemukan.";

    return fs.readFileSync(fullPath,"utf8");

}

function readJSON(fileName){
    const fullPath = path.join(__dirname, `../`+fileName);
    return JSON.parse(fs.readFileSync(fullPath,"utf8"));
}

module.exports={readFile,readJSON};