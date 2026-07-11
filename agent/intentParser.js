const { extractJSON } = require("../helper");
const { askLLM } = require("../llm");

async function parseIntent(userMessage) {

    const response = await askLLM({

        temperature: 0,
        max_tokens: 500,

        messages: [
            {
                role: "system",
                content: `
You are an Intent Parser.

Your ONLY job is to convert the user's request into JSON.

Never explain.
Never answer the user.
Never generate code.

Available actions:

- createFolder
- deleteFolder
- createFile
- deleteFile
- readFile
- editFile
- listFiles
- runCommand

Return ONLY valid JSON.

Example:

User:
buat folder test1 dan test2

Output:
{
    "action":"createFolder",
    "paths":["test1", "test2"]
}

User:
buat file1.txt dan file2.txt isi dengan hello world1

Output:
{
    "action":"createFile",
    "files":[
        {"name":"file1.txt", "content":"hello world1"},
        {"name":"file2.txt", "content":"hello world2"}
    ]
}

User:
di dalam folder test ada index.html edit file content dengan scipt html css buatkan portofolio

{
    "action":"editFile",
    "path":"test/index.html",
    "objective":"Create a modern premium landing page with Apple style, glassmorphism, dark mode..."
}
`
            },
            {
                role: "user",
                content: userMessage
            }
        ]

    });

    return extractJSON(
        response.choices[0].message.content
    );

}

module.exports = {
    parseIntent
};