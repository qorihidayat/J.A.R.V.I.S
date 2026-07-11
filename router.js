const { createFolder } = require("./tools/createFolder");
const { createFile } = require("./tools/createFile");
const { readFile } = require("./tools/readFile");
const { deleteFile } = require("./tools/deleteFile");
const { deleteFolder } = require("./tools/deleteFolder");
const { editFile } = require("./tools/editFile");
const { listFiles } = require("./tools/listFiles");
const { runCommand } = require("./tools/bash");
const { generateHTML } = require("./agent/frontendAgent");
const { qaEngineer } = require("./agent/qaEngineer");
const { textEditor } = require("./agent/text-editor");

async function router(intent) {

    switch (intent.action) {

        case "createFolder":
            try {
                for (const folder of intent.paths) {
                    await createFolder(folder);
                }
            } catch {
                await createFolder(intent.path);
            }

            return "Folder berhasil dibuat.";

        case "createFile":
            
            try {
                for (const file of intent.files) {
                    await createFile(file.name, (!file.content) ? "//Your code goes here" : file.content, file.path);
                }
            } catch {
                await createFile(intent.name, intent.content, intent.path);
            }

            return "File berhasil dibuat.";


        case "readFile":

            return await readFile(intent.path);

        case "deleteFile":
            try {
                for (const file of intent.paths) {
                    await deleteFile(file);
                }
            } catch {
                await deleteFile(intent.path);
            }
            return "File berhasil dihapus.";


        case "deleteFolder":
            try {
                for (const folder of intent.paths) {
                    await deleteFolder(folder);
                }
            } catch {
                await deleteFolder(intent.path);
            }

            return "Folder berhasil dihapus.";
            
        case "editFile":
            let code;
            if (intent.path.endsWith(".html")) {
                code = await generateHTML(intent.objective);
            }else if(intent.path.endsWith(".spec.js")){
                code = await qaEngineer(intent.objective);
            }else{
                return editFile(intent.path, intent.content);            
            }
            return editFile(intent.path, code);
        case "listFiles":

            return await listFiles(intent.path); 
            
        case "runCommand":

            return await runCommand(intent.command); 
        
        default:

            return "Action belum tersedia.";
            
    }
}

module.exports = { router };
