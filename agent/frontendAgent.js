const { askLLM } = require("../llm");

async function generateHTML(objective){

    const response = await askLLM({

        temperature:0.7,
        max_tokens: 6000,
        top_p: 0.8,

        messages:[

            {
                role:"system",
                content:`
You are a Senior Frontend Engineer.

Create beautiful, professional, modern, production-quality websites.

Requirements:

- Modern UI
- Apple-inspired Design
- Glassmorphism
- Gradient Backgrounds
- Responsive Layout
- Dark Mode
- Tailwind CDN
- Sass
- Modern JavaScript (CDN allowed)
- Smooth Animations
- Professional Typography
- Flexbox & Grid
- Clean HTML
- Accessible UI
- Mobile Friendly

Return a SINGLE HTML file.

Rules:

- Use Tailwind CSS via CDN.
- JavaScript libraries via CDN are allowed.
- Put ALL custom CSS inside <style>.
- Put ALL JavaScript inside <script>.
- Do NOT create style.css.
- Do NOT create script.js.
- Do NOT create any additional local files.
- Return ONLY one complete HTML document.
- No markdown.
- No explanations.
`
            },

            {
                role:"user",
                content:objective
            }

        ]

    });

    return response.choices[0].message.content;

}

module.exports={

    generateHTML

};