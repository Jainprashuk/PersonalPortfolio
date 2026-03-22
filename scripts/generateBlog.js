import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


// 🔥 fallback topics (safe + high quality)
const fallbackTopics = [
  "How I built a scalable React app with Tailwind and Redux",
  "Optimizing React performance in real-world apps",
  "Handling authentication in MERN apps using JWT",
  "Building reusable UI components with React and Tailwind",
  "Common mistakes I made while learning React and how I fixed them"
];


// 🔥 slug
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
}


// 🔥 existing blogs
function getExistingSlugs(){
  if (!fs.existsSync("blogs")) return [];

  return fs.readdirSync("blogs").map(file =>
    file.replace(".md", "")
  );
}


// 🔥 AI topic generator (MAIN MAGIC 🔥)
async function generateTopicsWithAI(){

  const prompt = `
You are a senior frontend engineer.

Generate 10 blog topic ideas for a developer who specializes in:

- React
- Next.js
- Tailwind CSS
- MERN stack

Rules:

- ONLY frontend / React related topics
- No backend, DevOps, Docker, databases
- Focus on real-world problems
- Focus on performance, UI, architecture, scaling frontend apps
- Topics should feel like real developer blog titles

Return ONLY a JSON array.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);

  } catch (e) {
    console.log("AI topic generation failed, fallback used");
    return fallbackTopics;
  }
}


// 🔥 pick topic (smart + no duplicate)
async function getTopic(){

  const existing = getExistingSlugs();

  const useAI = Math.random() < 0.7;

  let topics = [];

  if(useAI){
    topics = await generateTopicsWithAI();
  } else {
    topics = fallbackTopics;
  }

  // remove already written topics
  const filtered = topics.filter(t => 
    !existing.includes(slugify(t))
  );

  const finalList = filtered.length > 0 ? filtered : topics;

  return finalList[Math.floor(Math.random() * finalList.length)];
}


// 🔥 GEMINI
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


// 🔥 GROQ fallback
async function generateWithGroq(prompt) {

  console.log("Using Groq fallback...");

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}


// 🔥 content generator
async function generateBlogContent(prompt){
  try{
    return await generateWithGemini(prompt);
  }catch{
    return await generateWithGroq(prompt);
  }
}


// 🔥 MAIN
async function generateBlog() {

  const topic = await getTopic();

  console.log("🔥 Selected topic:", topic);

  const slug = slugify(topic);

  if (fs.existsSync(`blogs/${slug}.md`)) {
    console.log("Blog already exists, skipping...");
    return;
  }

  let style = "";
  try {
    style = fs.readFileSync("writingStyle.txt", "utf-8");
  } catch {
    style = `
I prefer writing blogs in a simple and practical way.
I focus on real-world implementation instead of theory.
I explain things using my own project experiences.
I care about UI, performance, and clean code.
`;
  }

  const prompt = `
${style}

You are NOT an AI.

You are Prashuk Jain, a full-stack developer specializing in React, Next.js, and MERN stack.

Write a developer blog post in a natural, human tone.

Topic:
"${topic}"

Guidelines:

- Conversational tone
- Use real-world thinking
- Add lines like:
  "In one of my projects..."
  "I ran into this issue when..."
  "What worked for me was..."
- Avoid robotic tone
- Slight imperfections are OK
- Add opinions

Structure:

1. Short personal introduction
2. 4-5 sections
3. Real-world examples
4. One code example (if needed)
5. Best practices
6. Conclusion with learnings

Formatting:

- Markdown
- Short paragraphs
- Bullet points
`;

  const content = await generateBlogContent(prompt);

  const markdown = `---
title: ${topic}
date: ${new Date().toISOString()}
description: Blog about ${topic}
---

${content}
`;

  if (!fs.existsSync("blogs")) {
    fs.mkdirSync("blogs");
  }

  fs.writeFileSync(`blogs/${slug}.md`, markdown);

  console.log("✅ Blog saved:", slug);
}


// 🔥 run
(async () => {
  await generateBlog();
})();
