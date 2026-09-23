# 🧠 AuDHD Workspace App (Working Title)

> **An all-in-one, neurodivergent-friendly digital workspace designed to bridge the gap between structured routine and real-time impulsivity.**

The **AuDHD Workspace App** is a digital therapeutic and time-management platform built specifically for individuals with **Autism Spectrum Disorder (ASD)** and **Attention-Deficit/Hyperactivity Disorder (ADHD)**. By implementing a **Progressive Disclosure UI**, it resolves the "Design Paradox"—offering advanced task triage, time auditing, and AI breakdown tools without overloading the user with visual clutter.

---

## ✨ Core Features

### 1. ⏳ Block-Based Visual Time Engine

* **Visual Time Blocks:** Replaces dense calendar text with clean, graphical time representations (SVG/Canvas rings or hourglasses) to combat **time blindness**.
* **Contextual Tool Checklist:** Binds necessary tools (`tools_required`: e.g., *Laptop*, *Noise-canceling headphones*, *IDE*) directly to each block.
* **Low-Distraction Mode:** Shows **only** active task details and associated tool icons during a live focus block.

### 2. ⚡ Frictionless Impulse Buffer ("Brain Dump")

* **Zero-Friction Quick Capture:** Instantly captures intrusive thoughts via hotkeys, floating widgets, or voice-to-text (**Whisper API**).
* **Instant Auto-Clear:** Instantly logs the thought and redirects the user back to their active focus block with calming visual feedback.

### 3. 🤖 AI Triage & Judgment Engine ("The Judge")

* **Impulse Filtering:** Imposes a configurable **24-hour cooling-off period** on spontaneous ideas to curb ADHD impulsivity.
* **Micro-Step Breakdown:** Uses LLMs (GPT-4o / Claude / Local Llama-3) to decompose complex tasks into sub-15-minute actionable micro-steps.
* **Structured Output:** Automatically compiles validated tasks into structured JSON objects ready for schedule insertion.

### 4. 📊 Time Audit & Retrospective Coach

* **Passive Time Tracking:** Background timers monitor variance between estimated vs. actual task durations.
* **Empathetic AI Micro-Retrospectives:** Uses gentle CBT-style conversational prompts post-task to analyze delays without triggering Rejection Sensitivity Dysphoria (RSD).
* **Predictive Estimation:** Analyzes historical trends to automatically suggest accurate durations for recurring tasks.

---

## 🏗️ System Architecture Overview

```
+-------------------------------------------------------------------------+
|                              FRONTEND                                   |
|   React / Next.js / React Native (Canvas/SVG Block Timelines, Low-Load UI) |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                                BACKEND                                  |
|   Node.js / FastAPI Engine (REST API / WebSocket Real-Time Sync)        |
+-------------------------------------------------------------------------+
       │                            │                            │
       ▼                            ▼                            ▼
+--------------+           +------------------+         +-----------------+
|  DATABASE    |           |   AI / LLM PIPELINE  |         | SPEECH-TO-TEXT  |
| PostgreSQL / |           | OpenAI / Claude /|         | OpenAI Whisper  |
| Supabase     |           | Local Llama-3    |         | API             |
+--------------+           +------------------+         +-----------------+

```

---

## 🚀 Technical Stack

* **Frontend:** React / Next.js, Tailwind CSS, Framer Motion, HTML5 Canvas / SVG
* **Backend:** Node.js (Express) or Python (FastAPI)
* **Database:** PostgreSQL / Supabase
* **AI & Audio Processing:** OpenAI API (GPT-4o / Whisper), Anthropic Claude API, or Ollama (Local LLM)
* **Authentication:** NextAuth.js / Supabase Auth

---

## 🗄️ Database Schema Preview

```sql
-- Tasks Table Schema
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    estimated_duration INT NOT NULL, -- In minutes
    actual_duration INT DEFAULT 0,  -- In minutes
    tools_required TEXT[],          -- Array of tool names/icons
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed', 'triaged'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brain Dump / Impulse Buffer Schema
CREATE TABLE brain_dumps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    raw_content TEXT NOT NULL,
    cooling_until TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'buffered', -- 'buffered', 'processed', 'discarded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

```

---

## 🏁 Getting Started

### Prerequisites

* Node.js ($\ge v18.0.0$)
* PostgreSQL database or Supabase instance
* OpenAI / Anthropic API Key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/audhd-workspace-app.git
cd audhd-workspace-app

```


2. **Install dependencies:**
```bash
npm install

```


3. **Set up Environment Variables:**
Create a `.env.local` file in the root directory and add your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/audhd_db"
NEXT_PUBLIC_OPENAI_API_KEY="your-openai-api-key"
NEXTAUTH_SECRET="your-super-secret-key"

```


4. **Run the development server:**
```bash
npm run dev

```


Open [http://localhost:3000](http://localhost:3000?utm_source=gemini) in your browser.

---

## 🤝 Contributing

Contributions are warmly welcomed! Because this project directly serves the neurodivergent community, PRs focusing on accessibility (a11y), visual/cognitive load reduction, and UX responsiveness are prioritized.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
