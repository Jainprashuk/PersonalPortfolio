import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getLatestTechTopic() {

  const topics = [];

  try {
    // HackerNews
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
    // Dev.to
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
    // GitHub trending (open source projects)
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

async function generateBlog() {

  const topic = await getLatestTechTopic();
  console.log("Selected topic:", topic);


  console.log("Generating blog about:", topic);

  const prompt = `
You are a senior software engineer and technical blogger.

Write a high-quality developer blog post in **Markdown** about:

"${topic}"

Requirements:

- Length: 700–1000 words
- Audience: software developers
- Tone: professional but easy to understand
- Format properly using Markdown

Structure:

1. Introduction explaining the topic and why it matters
2. 3–4 well explained sections with clear headings
3. At least one practical JavaScript code example
4. Real-world use cases
5. Best practices or tips
6. A short conclusion summarizing key insights

Formatting rules:

- Use Markdown headings (##, ###)
- Use bullet points where helpful
- Include a JavaScript code block if helpful
- Keep paragraphs short and readable
- Do NOT include the blog title in the content (title is already provided)

Make the blog informative, practical, and useful for developers.
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  const result = await model.generateContent(prompt);

  console.log("Blog generated successfully!");

  const content = result.response.text();

  const markdown = `---
title: ${topic}
date: ${new Date().toISOString()}
description: Blog about ${topic}
---

${content}
`;

  const slug = slugify(topic);

  console.log("Generated slug:", slug);

  fs.writeFileSync(`blogs/${slug}.md`, markdown);

  console.log("Blog generated:", slug);

}

generateBlog();