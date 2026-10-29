# TaskVeda AI Blog - Keyword Map & Deployment Guide

Created: 29 October 2026
Target market: India, English (en-IN)
Goal: organic search + AI answer-engine visibility for the free 11-day AI bootcamp.

## 1. How the keywords were researched

Live Google Autocomplete was queried from the terminal with `gl=in&hl=en` on 29 October 2026 for these seeds:

- free ai bootcamp
- free ai bootcamp for students
- ai tools for students
- ai tools for students to study free
- prompt engineering course
- prompt engineering for beginners
- ai for college students
- ai internship
- how to get ai internship
- ai portfolio project
- ai projects for students
- learn ai free
- chatgpt for students
- ai automation course
- ai resume project
- ai tools for resume
- best ai tools 2026
- ai bootcamp with certificate

Autocomplete reflects real query demand in India, not search volume. Before spending on ads or making big content bets, confirm volumes in Google Search Console, Google Keyword Planner or Ahrefs/Semrush.

## 2. The five pages and their target keywords

| # | File | Primary keyword | Secondary keywords | Search intent | Funnel stage |
|---|------|-----------------|--------------------|---------------|--------------|
| 1 | free-ai-bootcamp-with-certificate.html | free ai bootcamp with certificate | free ai bootcamp for students, free ai bootcamp online, ai bootcamp for students free, free gen ai bootcamp, ai bootcamp india, free ai course with certificate | Commercial investigation | Bottom |
| 2 | best-free-ai-tools-for-students.html | best free ai tools for students | ai tools for students to study free, ai tools for students free, ai tools for resume building free, free ai tools 2026, ai tools for college students | Informational | Top / Middle |
| 3 | prompt-engineering-for-beginners.html | prompt engineering for beginners | prompt engineering course free with certificate, how to learn prompt engineering for beginners, chatgpt prompt engineering for beginners, prompt engineering tutorial, ai prompts for students | Informational | Top |
| 4 | ai-portfolio-projects-for-students.html | ai portfolio projects for students | ai projects for students with source code, ai resume projects github, best ai portfolio projects, ai projects for students github, beginner ai projects | Informational | Middle |
| 5 | ai-internship-for-freshers.html | ai internship for freshers | ai internship for students, ai internship work from home, how to get ai internship, ai internship india, ai internship remote, ai intern jobs | Commercial investigation | Bottom |

All five pages internally link to each other and to the bootcamp page:
`https://www.taskveda.in/11-day-ai-tools-prompt-engineering.html`

## 3. Keyword clusters to expand later

### Bootcamp cluster
- free ai bootcamp with certificate
- free ai bootcamp online
- free ai bootcamp for students
- ai bootcamp for students free
- free gen ai bootcamp
- free ai bootcamp with job placement
- ai bootcamp india
- ai bootcamp bangalore / chennai / mumbai / pune / delhi
- free ai course with certificate
- ai course after 12th
- ai course after 12th commerce / arts / science

### Tools cluster
- best free ai tools for students
- ai tools for students to study free
- ai tools for students for exam
- ai tools for students assignment
- ai tools for students like chatgpt
- ai tools for resume building free
- ai tools for resume writing free
- best ai tools 2026 free
- chatgpt for students free india
- notebooklm for students
- gemini for students

### Prompt cluster
- prompt engineering for beginners
- prompt engineering course free with certificate
- how to learn prompt engineering for beginners
- chatgpt prompt engineering for beginners
- prompt engineering tutorial for beginners
- prompt engineering for dummies
- ai prompts for students
- prompt engineering roadmap

### Projects cluster
- ai portfolio projects for students
- ai projects for students with source code
- ai projects for students github
- ai resume projects github
- best ai portfolio projects
- gen ai portfolio projects
- agentic ai portfolio projects
- ai resume analyzer project github
- ai projects for students in python

### Internship cluster
- ai internship for freshers
- ai internship for students
- ai internship work from home
- ai internship remote
- ai internship india
- ai internship in bangalore / chennai / mumbai / pune
- how to get ai internship
- how to get ai ml internship
- ai intern salary
- ai intern jobs

## 4. On-page SEO included in every file

- Unique title tag with primary keyword and 2026 freshness signal
- Meta description with the primary keyword and a clear benefit
- Meta keywords (harmless, ignored by Google but requested)
- Canonical URL
- Robots meta with max-image-preview:large and max-snippet:-1
- Open Graph tags (title, description, image, URL, type, locale)
- Twitter card tags
- Article published and modified dates
- Author and section metadata
- One H1 per page, keyword-led H2/H3 structure
- Descriptive internal links between all five posts
- Clean, mobile-first, dependency-free HTML and CSS

## 5. AEO (Answer Engine Optimisation)

Every article includes:

- A "Quick answer" box in the first screen, written as a 40-60 word direct answer
- "Key takeaways" list
- FAQ sections with 6 question-and-answer pairs
- FAQPage structured data matching the visible FAQ text
- Question-style H2/H3 headings
- Tables for comparisons and scannable facts
- Definitions written in plain language
- HowTo structured data on the prompt engineering guide
- Course and Offer structured data on the bootcamp guide

## 6. GEO (Generative Engine Optimisation)

- `llms.txt` at the site root with a summary, key facts, canonical links and usage notes for AI assistants
- Clear, quotable sentences and factual lists that are easy for LLMs to cite
- Consistent entity naming: TaskVeda, Asma Fathima, 11-Day AI Tools & Prompt Engineering Challenge
- Explicit date stamps for freshness
- Internal linking so crawlers can connect the topic cluster
- robots.txt explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent and cohere-ai
- No fabricated statistics or citations; claims are either verifiable or clearly framed as guidance

## 7. Structured data summary

| File | Schema types |
|------|--------------|
| free-ai-bootcamp-with-certificate.html | BlogPosting, Course, Offer, BreadcrumbList, FAQPage |
| best-free-ai-tools-for-students.html | BlogPosting, BreadcrumbList, FAQPage |
| prompt-engineering-for-beginners.html | BlogPosting, BreadcrumbList, FAQPage, HowTo |
| ai-portfolio-projects-for-students.html | BlogPosting, BreadcrumbList, FAQPage |
| ai-internship-for-freshers.html | BlogPosting, BreadcrumbList, FAQPage |
| index.html | CollectionPage, ItemList, BreadcrumbList |

## 8. Deployment steps

1. Upload the whole folder to `https://www.taskveda.in/blog/`:
   - `index.html` becomes `https://www.taskveda.in/blog/`
   - the five article files sit beside it
2. Upload `llms.txt` and `robots.txt` to the domain root (`https://www.taskveda.in/llms.txt` and `/robots.txt`). If a robots.txt already exists, merge the rules instead of overwriting.
3. Upload `sitemap.xml` to the domain root, or merge the URLs into the existing sitemap.
4. Submit `https://www.taskveda.in/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
5. Add the five blog links to the main site navigation and footer.
6. Link to the blog hub from the bootcamp landing page to pass internal authority.
7. Test every URL after upload:
   - `https://www.taskveda.in/blog/`
   - `https://www.taskveda.in/blog/free-ai-bootcamp-with-certificate.html`
   - `https://www.taskveda.in/blog/best-free-ai-tools-for-students.html`
   - `https://www.taskveda.in/blog/prompt-engineering-for-beginners.html`
   - `https://www.taskveda.in/blog/ai-portfolio-projects-for-students.html`
   - `https://www.taskveda.in/blog/ai-internship-for-freshers.html`
8. Validate structured data with Google Rich Results Test and Schema.org Validator.
9. Run PageSpeed Insights on the blog hub and one article.

If the files are deployed at the domain root instead of `/blog/`, update the canonical, Open Graph `og:url`, JSON-LD URLs, `llms.txt` and `sitemap.xml` to match. Do not publish two versions of the same article.

## 9. Measurement plan

- Google Search Console: impressions and clicks per primary keyword after 2-4 weeks
- Average position for "free ai bootcamp with certificate" and "ai internship for freshers"
- FAQ rich results impressions
- Referral traffic to the bootcamp form from each article
- Track registration form submissions with a UTM parameter, for example:
  `https://www.taskveda.in/11-day-ai-tools-prompt-engineering.html?utm_source=blog&utm_medium=organic&utm_campaign=ai_bootcamp_2026&utm_content=free_ai_bootcamp_certificate`

## 10. Honest notes

- Search volume was not available from autocomplete; validate before prioritising.
- The certificate is a completion certificate, not a placement guarantee. The content reflects that on purpose.
- Free tiers, tools and platform policies change; review the tool list quarterly.
- Update the `lastmod` dates and article modified dates whenever content changes.
