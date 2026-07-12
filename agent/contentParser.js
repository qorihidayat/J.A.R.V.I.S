const { extractJSON } = require("../helper");
const { askLLM } = require("../llm");

async function contentParser(userMessage) {

    const response = await askLLM({

        temperature: 0,
        max_tokens: 500,

        messages: [
            {
                role: "system",
                content: `
You are an Intent Parser.

Extract the user's intent.

Return ONLY valid JSON.

Available actions:

- music
- image
- search
- berita

Rules:

- Return only JSON.
- Fill only relevant fields.
- Use null if a field is not applicable.
- Never explain.

Return ONLY valid JSON.

Example:

User:
musik greenday 10 lagu

Output:
{
    "action": "music",
    "title": "GreenDay",
    "qty": 10
}

User:
bikinin gambar orang memancing 3 gambar
Output:
{
    "action": "image",
    "title": "orang memancing",
    "qty": 3
}

User:
cari berita hari ini
Output:
{
    "action": "search",
    "title": "berita hari ini",
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
    contentParser
};