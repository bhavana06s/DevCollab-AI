# 🏗️ DevCollab AI — Real-Time Developer Workspace & Intelligent Automation Platform

> **GitHub meets Notion meets Slack** — An all-in-one real-time collaborative platform and automated project operating system built for student developer teams and software engineering groups.

---

## 🌟 Key Highlights & Architecture

DevCollab AI combines project tracking, live presence synchronization, code snippet management, rich markdown documentation with point-in-time version rollback, role-based access control, an **Automated Event-Driven Engine**, and **AI Project Assistant capabilities**.

### 🎨 Dual-Colored Professional Design System
- **Default Theme**: *Electric Indigo (`#6366F1`)* & *Cyber Emerald (`#10B981`)* on an Obsidian Dark Canvas (`#080C16`).
- **Alternative Dual Themes**:
  - *Neon Violet & Cyan Matrix* (`#8B5CF6` / `#06B6D4`)
  - *Sapphire & Amber Pro* (`#3B82F6` / `#F59E0B`)
- Glassmorphic panels, glowing status chips, micro-animations, and high-contrast typography powered by **Plus Jakarta Sans** and **JetBrains Mono**.

---

## 🚀 Feature Breakdown

### 1. 🏢 Workspaces, Projects & Roles
- **Multi-Workspace & Multi-Project Hierarchy**: Workspaces represent teams/clubs (e.g., *Hyperion Dev Labs*, *OpenSource Hackers Club*), hosting multiple isolated projects (e.g., *CampusConnect Web Platform*, *Autonomous Rover Firmware*).
- **Granular Role-Based Access Control (RBAC)**:
  - **👑 Owner**: Full workspace ownership, subscription management, project deletion, and team governance.
  - **🛡️ Admin**: Project management, member role assignments, and automation rule configuration.
  - **💻 Member**: Creation and updates of tasks, wiki docs, snippets, and comments.
  - **👁️ Viewer**: Read-only access for evaluators, mentors, and QA observers.
- **Interactive Persona Switcher**: Top navbar switcher allows live testing of all 4 roles (*Alex Chen [Owner]*, *Riya Sharma [Admin]*, *Ankush Verma [Member]*, *Dev Patel [Member]*, *Sara Kim [Viewer]*).
- **Email Invitation System**: Tokenized onboarding links (`https://devcollab.io/join/...`) with one-click copy.

---

### 2. 📋 Kanban & Multi-View Task Management
- **Interactive Kanban Board**: `To Do` → `In Progress` → `In Review` → `Done` columns with smooth drag-and-drop.
- **Multiple Views**:
  - **Kanban View**: Column counters, priority badges, live viewer avatar pulses, and attachment/comment counts.
  - **List View**: Sortable tabular view for sprint backlog reviews and status toggles.
  - **Calendar View**: Monthly calendar scheduling tasks directly on their target due dates.
- **Task Detail Modal**:
  - Priority pills (**P0 Urgent Red**, **P1 High Amber**, **P2 Normal Indigo**).
  - Assignee selectors, due date countdowns with overdue flags.
  - File attachments list with simulation upload.
  - **Live Comment Thread with `@mentions`**: Typing `@` triggers team autocomplete flyouts and immediately sends in-app notifications to mentioned users.

---

### 3. 🤖 AI Project Assistant & Intelligent Automation OS
- **✨ Summarise This Project**: Generates an executive progress report, milestone velocity percentage, key achievements, and recommended next sprint focus.
- **🚨 What's Blocking Us?**: Intelligent blocker detection that identifies stale `In Progress` items, impending deadline SLA breaches (<48h), and unassigned bottlenecks with actionable resolutions.
- **📊 Daily Engineering Standup Report**: Formats 24h task movements into Slack/Discord style (*Yesterday Completed*, *Today In Flight*, *Impediments*) with 1-click clipboard export.
- **⚡ AI Task Breakdown Generator**: Transforms feature descriptions (e.g. *"Build an OAuth2 login system with 2FA"*) into 6 structured subtasks with estimated hours and priorities, ready to add to the Kanban board in 1 click.
- **⚙️ Event-Driven Automation Engine**:
  - *Smart Deadline Escalator*: Auto-escalates tasks due in <48h to P0 priority.
  - *Automated Code Review on Snippet Save*: Scans snippets upon creation for security flaws.
  - *Instant Release Note Generator*: Auto-creates a Wiki changelog when all milestone P0 tasks hit `Done`.
  - *Stalled Task Blocker Detector*: Flags tasks in `In Progress` for >48h.
  - *Run Automation Diagnostics*: 1-click audit button that analyzes active project tasks and executes active automation rules.

---

### 4. 💻 AI Deep Code Reviewer
- Multi-language static analysis and AST auditing supporting **JavaScript**, **Python**, **Java**, **C++**, and **Go**.
- **Quality Score Gauge (1.0 to 10.0)** with multi-vector ratings:
  - *Bugs & Correctness*
  - *Security & OWASP Top 10* (evaluates `eval`, loose equality, raw pointer memory leaks, bare `except`, goroutine leaks)
  - *Performance & Big-O Complexity*
  - *Maintainability & Clean Code*
- Line-by-line actionable findings with severity indicators.
- **Proposed AI Remediation Patch (Diff)** with 1-click *"Apply Fix to Editor"* and *"Save as Project Snippet"*.

---

### 5. 📦 Code Snippet Manager
- Shared reusable project repository for middleware, algorithms, and microservice routines.
- Tag filtering, search by title/description, and language filters (*JavaScript*, *Python*, *Go*, *C++*, *Java*, *SQL*, *Bash*).
- Syntax-highlighted dark container with line numbers.
- One-click copy with animated feedback and direct *"Review with AI"* integration.

---

### 6. 📖 Notion-Style Documentation Wiki
- Structured project knowledge base with rich text editing.
- Supports headings (H1, H2, H3), bullet points, checklists (`[x]`), tables, code blocks, and blockquotes.
- **Cross-Document Linking (`[[Page Title]]`)**: Renders interactive links that switch between wiki documents.
- **Point-in-Time Version History**: Chronological revision timeline (v1.0, v2.0, v3.0) with change summaries and **1-click Rollback** to restore previous snapshots.

---

### 7. ⚡ Real-Time Collaboration & Activity Feed
- **WebSocket Protocol (Socket.IO)**:
  - Live task card drag-and-drop broadcast across all connected clients.
  - **Live Presence Indicators**: Displays *"Ankush is viewing this task"* with animated pulse rings.
  - Peer Simulation Button (*"Simulate Peer Sync"*) to demonstrate real-time WebSocket broker synchronization.
- **Immutable Activity Stream**: Chronological audit trail of all workspace events with filters by member and event type.
- **In-App Notification Centre**: Flyout drawer with badge counter for task assignments, @mentions, and AI blocker alerts.

---

### 8. 💳 Plan & Billing Center
- **Free Tier**: 1 workspace, 3 projects, 5 members, basic AI assistant runs.
- **DevCollab Pro**: Unlimited workspaces, projects, members, AI code review, and background automations.
- **Interactive Sandbox Checkout**:
  - Test credit card checkout simulation.
  - **GitHub Student Developer Pack 1-click verification** for university teams.

---

## 🛠️ Tech Stack & Setup

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Zustand, Lucide React, Socket.IO Client, Vanilla Dual-Palette CSS |
| **Backend** | Node.js, Express, Socket.IO Server, In-Memory DB, CORS |
| **Styling** | Custom Dual-Color Theme Tokens, Glassmorphism, Plus Jakarta Sans, JetBrains Mono |

### Running Locally

#### 1. Start the Backend Server (Port 5001)
```bash
cd server
npm install
node server.js
```

#### 2. Start the Frontend React App (Port 3000)
```bash
cd my-frontend
npm install
npm start
```

Visit `http://localhost:3000` in any modern web browser.
