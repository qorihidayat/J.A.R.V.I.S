function extractJSON(text) {

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {

        throw new Error("JSON not found");

    }

    return JSON.parse(match[0]);

}

module.exports = { extractJSON };