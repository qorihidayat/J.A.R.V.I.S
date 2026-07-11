const { askLLM } = require("../llm");
const { upsert } = require("../tools/memory");

async function memoryAgent(objective){
    const prefix = "```";

    const response = await askLLM({

        temperature:0,

        messages:[

            {
                role:"system",
                content:`
You are a Memory Extraction Agent.

Extract ONLY information that is useful in future conversations.

Return ONLY valid JSON.

Schema:

{
  "reply": "<assistant reply>",
  "memory": [
    {
      "action": "upsert",
      "key": "<key>",
      "value": "<value>"
    }
  ]
}

Long-term memories include:
- Name
- Birthday
- Job
- Skills
- Favorite
- Pets
- Long-term goals
- Stable personal information

Do NOT save:
- Today's activities
- Temporary plans
- Current location
- Current mood
- Meals
- Weather
- One-time events
- Casual conversations
- Questions

If the information is temporary, return:

"memory": []

Only save information that is likely to remain useful for months.

Return JSON only.
No markdown.
No explanations.
Never wrap the code inside ${prefix} or ${prefix}json.
`
            },

            {
                role:"user",
                content:objective
            }

        ]

    });

    const json = JSON.parse(response.choices[0].message.content);
    // console.log(json);
    

    if (json.memory.length > 0) {
        
        await upsert(json.memory);
    }

    return json.reply;

}

module.exports={

    memoryAgent

};