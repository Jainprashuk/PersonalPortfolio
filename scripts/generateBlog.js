import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function getLatestTechTopic() {

  const topics = [];

  const codingKeywords = [
    "javascript","typescript","react","node","next",
    "api","backend","frontend","web","programming",
    "software","database","devops","docker","kubernetes",
    "ai","machine learning","python","rust","golang",
    "system","performance","cloud","aws","microservices"
  ];

  const badWords = [
    "ask hn",
    "show hn",
    "hiring",
    "who is hiring",
    "challenge",
    "celebrate",
    "voices",
    "community",
    "event"
  ];

  function isGoodTopic(title){

    const lower = title.toLowerCase();

    const hasTechKeyword = codingKeywords.some(k =>
      lower.includes(k)
    );

    const hasBadWord = badWords.some(b =>
      lower.includes(b)
    );

    return hasTechKeyword && !hasBadWord;

  }

  try {

    const hn = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page");
    const hnData = await hn.json();

    topics.push(...hnData.hits.map(p=>p.title).filter(Boolean));

  } catch(e){
    console.log("HN fetch failed");
  }

  try {

    const dev = await fetch("https://dev.to/api/articles?top=5");
    const devData = await dev.json();

    topics.push(...devData.map(p=>p.title).filter(Boolean));

  } catch(e){
    console.log("Dev fetch failed");
  }

  const filtered = topics.filter(isGoodTopic);

  if(filtered.length > 0){

    return filtered[Math.floor(Math.random()*filtered.length)];

  }

  return "Modern JavaScript development best practices";

}

function slugify(title) {
  return title.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-");
}

async function generateWithGemini(prompt) {

  try {

    console.log("Trying Gemini...");

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch(err) {

    console.log("Gemini failed:", err.message);
    throw err;
  }
}

async function generateWithGroq(prompt) {

  console.log("Using Groq fallback...");

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
}

async function generateBlogContent(prompt){

  try{

    return await generateWithGemini(prompt);

  }catch{

    return await generateWithGroq(prompt);

  }
}

async function generateBlog() {

  const topic = await getLatestTechTopic();
  
  console.log("Selected topic:", topic);

  const prompt = `
You are a senior software engineer and technical blogger.

Write a high-quality developer blog post in Markdown about:

"${topic}"

Requirements:

- Length: 1000-1400 words
- Audience: software developers
- Tone: professional but easy to understand

Structure:

1. Introduction explaining the topic
2. 4-5 sections with headings
3. One JavaScript code example only if required to explain a concept, otherwise keep it conceptual
4. Real-world use cases
5. Best practices
6. Conclusion (including future trends and scenarios if applicable)

Formatting:

- Use Markdown headings
- Use bullet points
- Include JavaScript code block
- Keep paragraphs short
`;

  const content = await generateBlogContent(prompt);

  console.log("Blog generated successfully!");

  const markdown = `---
title: ${topic}
date: ${new Date().toISOString()}
description: Blog about ${topic}
---

${content}
`;

  const slug = slugify(topic);

  fs.writeFileSync(`blogs/${slug}.md`, markdown);

  console.log("Blog generated:", slug);
}

generateBlog();