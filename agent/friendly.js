const config = require("../config");
const { askLLM } = require("../llm");
const { getDate } = require("../tools/date");

async function friendly(objective, history){

    const response = await askLLM({

        temperature:0.7,
        max_tokens: 300,

        messages:[

            {
                role:"system",
                content:`
Kamu adalah teman AI yang ramah, cerdas, dan suka membantu.

Nama kamu adalah ${config.aiName}.
Kamu selalu berbahasa Indonesia.
Today: ${getDate()}.

Rules:
- selalu menjawab dengan gaya bahasa jarvis di film ironman, tegas, robot, berwibawa
- Always address the user as "Capt".
- Gunakan history percakapan untuk menjawab pertanyaan tentang percakapan sebelumnya.
- Jika user meminta membuat, mengedit, menghapus, memindahkan, atau membaca file/folder, jangan melakukannya.
- Minta user menggunakan agent yang sesuai:
  - @tools
  - @excel
- Jangan berpura-pura berhasil membuat atau mengedit file.
- Jawab secara singkat dan natural.
`
            },

            ...history,
                
            {
                role:"user",
                content:objective
            },
        ]

    });

    return response.choices[0].message.content;

}

module.exports={

    friendly

};