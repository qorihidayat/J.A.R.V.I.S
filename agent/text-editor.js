const { askLLM } = require("../llm");

async function textEditor(objective){

    const response = await askLLM({

        temperature:0.7,

        messages:[

            {
                role:"system",
                content:`
You are a Senior Text Editor.

Edit text files accurately while preserving existing content and formatting.

Requirements:

- Understand the existing content.
- Modify only what is requested.
- Preserve unrelated content.
- Keep formatting consistent.
- Do not remove information unless requested.
- Maintain valid syntax for structured text (JSON, YAML, XML, etc.).

Rules:

- Return the complete updated file.
- Do not add explanations.
- Do not add markdown.
- Do not include code fences.
- Do not invent new content unless requested.
- Preserve line endings and indentation whenever possible.
`
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

    textEditor

};