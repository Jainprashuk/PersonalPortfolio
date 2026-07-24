import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Posts are stored in the backend (MongoDB) now. Generated posts are POSTed
// there as drafts; a human approves them via /Admin/drafts.
const BACKEND_URL = process.env.BACKEND_URL || "https://portfolio-backend-two-zeta.vercel.app";
const ADMIN_KEY = process.env.ADMIN_KEY || process.env.ADMIN_SECRET;


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


// 🔥 existing posts — ask the backend for every slug (draft + published) so we
// don't regenerate a topic that already exists or is waiting for review.
async function getExistingSlugs(){
  if (!ADMIN_KEY) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/admin/posts`, {
      headers: { "x-admin-key": ADMIN_KEY },
    });
    if (!res.ok) return [];
    const posts = await res.json();
    return Array.isArray(posts) ? posts.map((p) => p.slug) : [];
  } catch {
    return [];
  }
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
- Frontend Optimization
- Frontend Best Bractices
- Frontend performance

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

  const existing = await getExistingSlugs();

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

  if (!ADMIN_KEY) {
    console.error("ADMIN_KEY (backend ADMIN_SECRET) is not set. Cannot post draft.");
    process.exit(1);
  }

  // Skip if the topic already exists in the backend (draft or published).
  const existingSlugs = await getExistingSlugs();
  if (existingSlugs.includes(slug)) {
    console.log("Post already exists in backend, skipping...");
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
- Explain concepts clearly with concrete, technically accurate detail
- Do NOT invent personal anecdotes, projects, company names, teammates, or
  benchmark numbers. Never fabricate first-person experience.
- Where a real personal example or a real metric would strengthen the post,
  insert a placeholder marker on its own line instead of making one up, e.g.
  "[AUTHOR: add a real example from your work here]" or
  "[AUTHOR: insert a real measured number]". A human fills these in during review.
- Avoid robotic tone
- Add opinions where they are genuinely defensible

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

  // Store the draft in the backend. It lands as status:draft (unpublished);
  // a human approves it into publication via /Admin/drafts.
  const res = await fetch(`${BACKEND_URL}/admin/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
    body: JSON.stringify({
      slug,
      title: topic,
      description: `Blog about ${topic}`,
      content,
      date: new Date().toISOString(),
      aiAssisted: true,
    }),
  });

  if (res.status === 201) {
    console.log("✅ Draft saved to backend:", slug);
  } else if (res.status === 409) {
    console.log("Draft already exists in backend, skipping:", slug);
  } else {
    const text = await res.text().catch(() => "");
    console.error(`Failed to save draft (HTTP ${res.status}): ${text.slice(0, 200)}`);
    process.exit(1);
  }
}


// 🔥 run
(async () => {
  await generateBlog();
})();
