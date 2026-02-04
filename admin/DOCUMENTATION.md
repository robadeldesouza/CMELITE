# SocialProof AI - Documentation
**Version:** 1.0.0  
**Created:** 2025-02-23  
**Framework:** React 19, TypeScript, Tailwind CSS, Vite

---

## 1. Introduction
SocialProof AI is a powerful dashboard that allows you to orchestrate multi-bot conversations. It is designed to create realistic "social proof" simulations for landing pages, webinars, and community events. By simulating active discussions between AI personas, you can increase conversion rates and engagement.

### Key Features
*   **Bot Army Management:** Create distinct personalities (Skeptics, Enthusiasts, etc.).
*   **Visual Timeline Editor:** Drag-and-drop interface to script conversations.
*   **AI Autopilot:** Generate full scripts using Google Gemini AI.
*   **Real-time Preview:** Draggable, floating phone simulation to test chats.
*   **Dark Mode:** Fully responsive UI with dark/light theme support.
*   **Persistence:** Auto-saves your work locally.

---

## 2. Requirements
To run this project locally or build for production, you need:
*   **Node.js:** Version 18.0 or higher.
*   **NPM or Yarn:** Package manager.
*   **Google Gemini API Key:** Required for AI generation features.

---

## 3. Installation & Setup

### Step 1: Unzip and Install
Extract the downloaded package. Open your terminal in the project root folder.

```bash
npm install
# or
yarn install
```

### Step 2: Configure Environment
Create a `.env` file in the root directory (if not exists) and add your API Key:

```env
API_KEY=your_google_gemini_api_key_here
```

### Step 3: Run Development Server
Start the local server to edit the app.

```bash
npm run dev
```
Access the app at `http://localhost:5173`.

---

## 4. Folder Structure

```
/
├── src/
│   ├── components/       # Reusable UI components (BotCard, Layout, ChatPreview)
│   ├── pages/            # Main application screens (Dashboard, RoomEditor)
│   ├── services/         # API integrations (Gemini AI logic)
│   ├── store.ts          # State management (Zustand + Persistence)
│   ├── types.ts          # TypeScript definitions
│   ├── index.tsx         # Entry point
│   └── App.tsx           # Main Router/Layout wrapper
├── index.html            # Main HTML file
├── tailwind.config.js    # Styling configuration
└── package.json          # Dependencies
```

---

## 5. Usage Guide

### Creating Bots
1.  Navigate to the **Bots** tab.
2.  Click "Gerar em Lote" (Batch Generate) to use AI to create 3-5 bots instantly.
3.  Define the "Wisdom Level" to control how authoritative they sound.

### Creating a Room
1.  Go to **Salas** (Rooms).
2.  Click "Nova Sala".
3.  Select which bots will participate in this conversation.

### Editing the Timeline
1.  Open a Room to enter the Editor.
2.  **Add Message:** Click "Adicionar Msg" to manually insert a bubble.
3.  **AI Generation:** Click "Gerar com IA". Enter a topic (e.g., "Black Friday Sale"). The AI will write the script for you.
4.  **Preview:** A floating phone window will appear. Drag it around the screen. Click the "Play" button to watch the conversation unfold in real-time.

---

## 6. Customization

### Changing Colors
Edit `tailwind.config.js` or the theme configuration in `index.html` to change the `brand` color palette.

### Localization
The app is currently hardcoded to **Portuguese (Brazil)**. To change text labels, edit the files in `src/pages/` and `src/components/`.

---

## 7. Support
For support, please contact the developer via the CodeCanyon profile page.
