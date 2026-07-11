const { askLLM } = require("../llm");

async function excelAgent(prompt, excelJson) {

    const response = await askLLM({

        temperature: 0,

        messages: [

            {
                role: "system",
                content: `
You are an Excel Agent.

You receive the current Excel table as JSON.

Return ONLY JSON.

Schema:

{
    "actions":[]
}

Supported actions:

setValue
setFormula
insertColumn

Always use the provided column mapping to determine Excel column letters.
Never guess column letters.
Never explain.
Never use markdown.
`
            },

            {
                role: "system",
                content: JSON.stringify(excelJson, null, 2)
            },

            {
                role: "user",
                content: prompt
            }

        ]

    });

    return JSON.parse(response.choices[0].message.content);

}

module.exports = excelAgent;