const { readJSON } = require("../tools/readFile");
const { askLLM } = require("../llm");

async function workspace(objective){

    const workspace = await readJSON("./memory.json");

    const response = await askLLM({
    temperature: 0,
    messages: [
        {
            role: "system",
            content: `
You are a Workspace Agent.

Your job is to answer questions using the provided workspace.

Rules:
- Never invent information.
- Answer only using the provided files.
- If not found, reply "Not found."
`
        },
        {
            role: "system",
            content: `Workspace:\n${JSON.stringify(workspace, null, 2)}`
        },
        {
            role:"user",
            content:objective
        },
    ]
});

    return response.choices[0].message.content;

}

module.exports={

    workspace

};