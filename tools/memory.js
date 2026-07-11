const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(__dirname, "../memory.json");

async function upsert(memories) {

    let memory = {};

    if (fs.existsSync(MEMORY_PATH)) {
        memory = JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8"));
    }

    for (const item of memories) {

        if (item.action === "upsert") {
            memory[item.key] = item.value;
        }

        if (item.action === "delete") {
            delete memory[item.key];
        }

    }

    fs.writeFileSync(
        MEMORY_PATH,
        JSON.stringify(memory, null, 4),
        "utf8"
    );

    return memory;
}

module.exports = {
    upsert
};