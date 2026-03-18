---
title: I Built an AI Agent That Writes My Daily Standup in Notion Automatically
date: 2026-03-18T06:05:39.552Z
description: Blog about I Built an AI Agent That Writes My Daily Standup in Notion Automatically
---

# I Built an AI Agent That Writes My Daily Standup in Notion Automatically

Every morning at 8:55 AM, the same ritual begins. I sit at my desk, open my calendar, scroll through yesterday’s GitHub commits, check my Jira board, and try to remember what exactly I was doing before that "quick" production hotfix derailed my afternoon. 

As a senior engineer, I know that documentation is the lifeblood of a healthy team. But let’s be honest: writing daily standups feels like manual data entry. It’s context switching at its worst. We are paid to solve hard problems, not to copy-paste ticket titles into a Notion database.

To solve this, I built an AI agent. It’s not just a script; it’s an autonomous workflow that monitors my activity, reasons about what’s important, and populates my "Daily Logs" in Notion before I even finish my first cup of coffee.

In this post, I’ll walk you through the architecture, the logic, and how you can stop manual reporting and start focusing on the code.

---

## 1. The Problem: The High Cost of "Low-Value" Tasks

In software engineering, we often talk about "toil"—the kind of work that is manual, repetitive, and provides no long-term value. Standup updates, while vital for team synchronization, are often pure toil for the individual contributor.

The friction comes from three places:

*   **Fragmentation:** Your work lives in GitHub, Jira, Slack, and Linear.
*   **Recency Bias:** You remember the bug you fixed ten minutes ago, but you forget the deep architectural review you did at 10:00 AM yesterday.
*   **The Blank Page Problem:** Even with the data in front of you, formatting it into a "Yesterday / Today / Blockers" format takes cognitive effort.

I wanted a system that acted as a silent observer. It needed to aggregate my digital footprint, summarize it with an understanding of technical nuance, and push it to Notion, which serves as our team’s source of truth.

---

## 2. The Architecture: From Script to Agent

A simple script would just fetch Jira tickets and list them. An **AI Agent**, however, interprets the importance of those tickets. It knows that a "Refactor of the Auth Module" is more significant than "Updated README.md."

The system I built follows a four-stage pipeline:

### The Collection Phase
The agent uses APIs to pull activity from the last 24 hours. 
- **GitHub:** Fetches PR descriptions and commit messages.
- **Jira/Linear:** Pulls tickets moved to "In Progress" or "Done."
- **Slack:** (Optional) Analyzes messages in specific channels to identify "Blockers."

### The Reasoning Phase
This is where the LLM (Large Language Model) comes in. I feed the raw JSON data from these APIs into a model (like GPT-4o or Claude 3.5 Sonnet) with a specific system prompt. The prompt instructs the AI to categorize tasks by impact and rewrite technical jargon into concise, readable bullet points.

### The Transformation Phase
The AI outputs a structured JSON object that matches my Notion database schema. It doesn't just output text; it maps data to properties like "Date," "Status," and "Category."

### The Delivery Phase
The agent uses the Notion SDK to check if an entry for today already exists. If it does, it updates it; if not, it creates a new page with a pre-defined template.

---

## 3. Engineering the Logic: Why Notion?

Notion is notoriously "fiddly" when it comes to its API. Unlike a simple text file, Notion uses a block-based structure. This means the agent can't just send a string of text; it has to construct an array of "rich text" objects.

The real challenge was handling the "Blockers" section. To make this work, I instructed the AI to look specifically for keywords like "waiting on," "blocked by," or "pending review" in my PRs and Slack messages. This turns the standup from a passive log into an active tool for project management.

Here is a simplified look at how the agent interacts with the Notion API using JavaScript:

```javascript
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Pushes the AI-generated standup to the Notion Database.
 * @param {Object} standupData - The structured output from the LLM.
 */
async function postToNotion(standupData) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Title': {
          title: [
            { text: { content: `Standup: ${new Date().toLocaleDateString()}` } }
          ]
        },
        'Status': {
          select: { name: 'Completed' }
        },
        'Tags': {
          multi_select: [{ name: 'Automated' }, { name: 'Engineering' }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [{ text: { content: 'Yesterday' } }] }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [{ text: { content: standupData.yesterday } }] }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [{ text: { content: 'Today' } }] }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [{ text: { content: standupData.today } }] }
        }
      ]
    });
    console.log("Standup synced successfully:", response.id);
  } catch (error) {
    console.error("Error pushing to Notion:", error.body);
  }
}
```

---

## 4. Real-World Use Cases

While I built this for daily standups, the "Agentic Aggregator" pattern has several high-value applications for dev teams:

*   **Automated Sprint Reviews:** At the end of a two-week cycle, the agent can aggregate all "Done" tickets and PRs to generate a high-level summary for stakeholders who don't want to read technical tickets.
*   **Onboarding Logs:** New hires often struggle to keep track of what they've learned. An agent can track the documentation they’ve read and the small PRs they’ve submitted to create a "Learning Journey" log.
*   **Incident Post-Mortems:** By pulling timestamps from PagerDuty and Slack conversations during an outage, an agent can create a draft timeline of the incident, saving hours of manual reconstruction.
*   **Personal Growth Tracking:** As an engineer, it’s hard to remember what you did six months ago during performance reviews. This agent creates a permanent, searchable record of your technical contributions.

---

## 5. Best Practices for AI Agents

Building an agent is easy; building a *reliable* agent is hard. Here are some best practices I learned during this build:

*   **Keep a Human in the Loop:** Never let the agent post directly to a public team channel (like a shared Slack channel) without a review step. My agent posts to my *private* Notion page first. I review it, make minor tweaks, and then it's ready.
*   **Context Window Management:** Don't dump your entire GitHub history into the prompt. Use a "Time Window" (e.g., the last 24 hours) to keep the LLM focused and reduce token costs.
*   **Privacy First:** Ensure your agent doesn't send sensitive API keys or hardcoded secrets to the LLM provider. Use a `.env` file and sanitize your logs before sending them to the inference engine.
*   **Handle Rate Limits Gracefully:** Both the Notion API and the GitHub API have rate limits. If you're pulling data for a large team, implement a queueing system or exponential backoff.
*   **Prompt Specificity:** Tell the AI who it is. A prompt like *"You are a Senior Staff Engineer summarizing technical work for a Product Manager"* will yield much better results than *"Summarize this data."*

---

## 6. Conclusion and Future Trends

The era of "Manual Documentation" is coming to an end. As LLMs become more integrated into our IDEs and version control systems, the barrier between "doing the work" and "reporting the work" will disappear.

In the near future, I expect we’ll see:
1.  **Autonomous Scrum Masters:** Agents that identify blockers across the team before a human even notices the delay.
2.  **Self-Documenting Codebases:** Where the documentation isn't just a static README, but a living entity that updates itself based on PR activity.
3.  **Context-Aware Notifications:** Instead of getting 50 GitHub notifications, an agent will provide a single, 3-sentence summary of the changes relevant to your specific module.

Building this Notion agent wasn't just about saving five minutes every morning. It was about reclaiming mental bandwidth. As developers, our focus is our most valuable asset. Any tool that protects that focus is a tool worth building.

If you find yourself dreading the daily "What did I do yesterday?" shuffle, I highly encourage you to look at your workflow through the lens of automation. The APIs are there, the LLMs are ready—the only thing missing is the bridge you build between them.
