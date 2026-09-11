# Builder AI: AI-Powered Website Builder

A full-stack AI website builder that turns a text prompt into a complete, editable, live-previewable React project similar in spirit to tools like Lovable or bolt.new. Built with **React**, **Express**, **MongoDB**, and the **AI SDK** (OpenRouter/OpenAI-compatible models), with a **Sandpack**-powered live code editor and preview.

![image](https://github.com/WarrenBillTT/Builder-AI/blob/main/builder-ai.png)

🔗 **Live Demo:** comming soon

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![AI SDK](https://img.shields.io/badge/AI_SDK-OpenRouter-412991?logo=openai&logoColor=white)
![Sandpack](https://img.shields.io/badge/Sandpack-Live_Preview-000000?logo=codesandbox&logoColor=white)

---

## About the Project

**Website** lets a user describe the site they want in plain language, and an AI agent plans the file structure, generates each file's code, validates/auto-fixes it, and renders it in a live in-browser sandbox all editable afterward through further chat-based revisions.

**Core flow:**
1. **Prompt** the user describes the website they want to build
2. **Plan** the AI generates a file plan (paths, descriptions, exports) for the project
3. **Generate** each planned file's code is generated (with concurrency control via `p-map`), normalized, and validated/auto-fixed
4. **Preview** the generated project renders live using Sandpack, with a file explorer and error monitor
5. **Revise** the user can chat further to request changes; the AI revises specific files
6. **Publish / Export** projects can be published (public shareable link) or exported as a ZIP

**Key features:**
- **AI Project Generation** structured, schema-validated code generation using `generateObject` with Zod schemas (`FileCodeSchema`, `FilePlanSchema`, `RevisionResultSchema`)
- **Agent Progress Dashboard** real-time visibility into planning/generating/revising status per file
- **Live Sandbox Preview** powered by `@codesandbox/sandpack-react`, with a file explorer and full-page preview mode
- **Chat-Based Revisions** iteratively refine the generated project through natural-language follow-up messages
- **Authentication** JWT + cookie-based auth with bcrypt password hashing
- **Project Persistence** projects (files, chat history, plan, status) are stored in MongoDB via Mongoose
- **Publish & Share** publish a project to a public, shareable preview page
- **Export as ZIP** download the generated project as a ZIP file (`jszip` + `file-saver`)
- **Code Validation & Auto-Fixing** a custom validator (`codeValidator.js`) catches and repairs common code issues before rendering

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 8 |
| Styling | Tailwind CSS 4 |
| Live Code Preview | Sandpack (`@codesandbox/sandpack-react`) |
| State | React Context (`AppContext`) |
| HTTP Client | Axios |
| Utilities | JSZip, FileSaver, lodash.debounce, moment, react-hot-toast |
| Backend | Node.js, Express 5 (ESM) |
| AI | AI SDK (`ai`, `@ai-sdk/openai`) via OpenRouter, Zod schemas |
| Database | MongoDB + Mongoose |
| Auth | JWT (`jsonwebtoken`), bcrypt, cookie-parser |
| Concurrency | p-map |

## Project Structure

```
Website/
├── client/
│   └── src/
│       ├── api/                 # Axios API client
│       ├── components/          # PromptInput, ChatPanel, FileExplorer, PreviewPanel,
│       │                        # AgentProgressDashboard, PublishModal, SandpackErrorMonitor, etc.
│       ├── context/
│       │   └── AppContext.jsx   # Global app state
│       ├── pages/                # HomePage, AuthPage, BuilderPage, PreviewPage, PublishPage
│       ├── utils/
│       │   ├── exportProject.js # ZIP export logic
│       │   └── sandpackUtils.js
│       └── App.jsx
└── server/
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── projectController.js
    │   └── chatController.js     # Handles chat-driven revisions
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Project.js            # Files, chat messages, plan, generation status
    ├── routes/
    │   ├── authRoutes.js
    │   └── projectRoutes.js
    ├── services/
    │   ├── ai.js                 # Planning + file generation pipeline
    │   ├── aiSchemas.js          # Zod schemas for structured AI output
    │   ├── prompts.js            # System prompts
    │   ├── codeValidator.js      # Post-generation validation/auto-fix
    │   ├── contentNormalizer.js
    │   └── diff.js
    └── server.js
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A MongoDB database (local or Atlas)
- An OpenRouter (or OpenAI-compatible) API key

### 1. Clone the repository
```bash
git clone https://github.com/WarrenBillTT/Website.git
cd Website
```

### 2. Server setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` with:
```env
PORT=3000
ORIGINS=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_preferred_model
AI_MAX_CONCURRENCY=6
```

Start the server:
```bash
npm run dev
```

### 3. Client setup
```bash
cd ../client
npm install
```

Create a `.env` file in `client/` with your API base URL, then start the dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

**Server**

| Command | Description |
|---|---|
| `npm run dev` | Starts the server with nodemon (auto-reload) |
| `npm start` | Starts the server |

**Client**

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the client for production |
| `npm run lint` | Runs oxlint |
| `npm run preview` | Previews the production build locally |

## License

This project was built for personal/educational use. Feel free to use it as a reference, but please don't copy it identically for your own portfolio.
