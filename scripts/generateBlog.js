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

  try {
    const hn = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page");
    const hnData = await hn.json();

    const hnTitles = hnData.hits
      .slice(0,5)
      .map(p => p.title)
      .filter(Boolean);

    topics.push(...hnTitles);
  } catch(e) {
    console.log("HN fetch failed");
  }

  try {
    const dev = await fetch("https://dev.to/api/articles?top=5");
    const devData = await dev.json();

    const devTitles = devData
      .map(p => p.title)
      .filter(Boolean);

    topics.push(...devTitles);
  } catch(e) {
    console.log("Dev.to fetch failed");
  }

  try {
    const gh = await fetch("https://ghapi.huchen.dev/repositories");
    const ghData = await gh.json();

    const ghTitles = ghData
      .slice(0,5)
      .map(r => `Why developers are excited about ${r.name}`)
      .filter(Boolean);

    topics.push(...ghTitles);
  } catch(e) {
    console.log("GitHub fetch failed");
  }

  if (topics.length === 0) {
    return "Latest trends in software development";
  }

  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics[randomIndex];
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

- Length: 700–1000 words
- Audience: software developers
- Tone: professional but easy to understand

Structure:

1. Introduction explaining the topic
2. 3–4 sections with headings
3. One JavaScript code example
4. Real-world use cases
5. Best practices
6. Conclusion

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