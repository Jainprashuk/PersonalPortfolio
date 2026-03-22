import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


// 🔥 YOUR SKILLS
const mySkills = [
  "react",
  "next.js",
  "javascript",
  "typescript",
  "frontend",
  "ui",
  "tailwind",
  "redux",
  "web performance",
  "auth",
  "api",
  "mern"
];


// 🔥 fallback topics
const fallbackTopics = [
  "How I built a scalable React app with Tailwind and Redux",
  "Optimizing React performance in real-world apps",
  "Handling authentication in MERN apps using JWT",
  "Building reusable UI components with React and Tailwind",
  "Common mistakes I made while learning React and how I fixed them"
];


// 🔥 scoring
function scoreTopic(title){
  const lower = title.toLowerCase();
  let score = 0;

  mySkills.forEach(skill => {
    if(lower.includes(skill)){
      score += 2;
    }
  });

  if(lower.includes("how") || lower.includes("guide")) score += 1;

  return score;
}


// 🔥 remove bad topics
function isGoodTopic(title){
  const badWords = [
    "ask hn","show hn","hiring","who is hiring",
    "challenge","celebrate","voices","community","event"
  ];

  const lower = title.toLowerCase();
  return !badWords.some(b => lower.includes(b));
}


// 🔥 ensure frontend relevance
function hasCoreFrontendKeyword(title){
  const lower = title.toLowerCase();

  return (
    lower.includes("react") ||
    lower.includes("frontend") ||
    lower.includes("javascript") ||
    lower.includes("ui") ||
    lower.includes("web")
  );
}


// 🔥 avoid generic AI topics
function isTooGenericAI(title){
  const lower = title.toLowerCase();

  return (
    lower.includes("human reasoning") ||
    lower.includes("thinking fast") ||
    lower.includes("philosophy") ||
    lower.includes("society")
  );
}


// 🔥 get existing blogs
function getExistingSlugs(){
  if (!fs.existsSync("blogs")) return [];

  return fs.readdirSync("blogs").map(file =>
    file.replace(".md", "")
  );
}


// 🔥 fetch + smart topic selection
async function getLatestTechTopic() {

  let topics = [];

  try {
    const hn = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page");
    const hnData = await hn.json();
    topics.push(...hnData.hits.map(p=>p.title).filter(Boolean));
  } catch(e){
    console.log("HN fetch failed:", e.message);
  }

  try {
    const dev = await fetch("https://dev.to/api/articles?top=5");
    const devData = await dev.json();
    topics.push(...devData.map(p=>p.title).filter(Boolean));
  } catch(e){
    console.log("Dev fetch failed:", e.message);
  }

  const existing = getExistingSlugs();

  const ranked = topics
    .filter(isGoodTopic)
    .filter(hasCoreFrontendKeyword)
    .filter(t => !isTooGenericAI(t))
    .map(t => ({ title: t, score: scoreTopic(t) }))
    .filter(t => t.score > 0)
    .filter(t => !existing.includes(slugify(t.title)))
    .sort((a,b) => b.score - a.score);

  if (ranked.length > 0) {
    const topN = ranked.slice(0, 5); // 🔥 pick from top 5
    const random = topN[Math.floor(Math.random() * topN.length)];
    return random.title;
  }

  return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
}


// 🔥 slug
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
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

  const topic = await getLatestTechTopic();
  console.log("Selected topic:", topic);

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

You are Prashuk Jain, a final-year Computer Science student and full-stack developer specializing in React, Next.js, and MERN stack.

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

1. Personal introduction
2. 4-5 sections
3. Real-world examples
4. One JavaScript example (if needed)
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
