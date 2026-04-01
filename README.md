# Quiz App 🎯

A simple quiz application built with **React**, **TailwindCSS**, and
**Framer Motion**.\
This app allows users to take quizzes, track scores, and save their high
scores locally.

------------------------------------------------------------------------

## 🚀 Features

-   Start, attempt, and finish quizzes
-   Timer countdown with visual alerts
-   High scores saved in local storage
-   Medal system 🥇🥈🥉 for top 3 scores
-   Responsive and modern UI with TailwindCSS
-   Smooth animations using Framer Motion

------------------------------------------------------------------------

## 🛠️ Installation & Setup

### 1. Clone the repository

``` bash
git clone https://github.com/navneetKushwaha-0N/-quiz-app.git
cd quiz-app
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Run the development server

``` bash
npm run dev
```

### 4. Open in browser

Go to 👉 <http://localhost:3000>

------------------------------------------------------------------------

## 📂 Project Structure

    quiz-app/
    │── public/             # Static assets
    │── src/
    │   ├── components/     # UI Components (Timer, HighScores, QuizCard...)
    │   ├── context/        # Global state (QuizContext)
    │   ├── utils/          # Helper functions (localStorage handling)
    │   ├── pages/          # Main pages (Home, Quiz, HighScores)
    │   └── App.jsx         # Main React App entry
    │── package.json        # Dependencies & scripts
    │── README.md           # Documentation

------------------------------------------------------------------------

## 🎨 Design Decisions & Architecture

-   **React Context API** → used for managing quiz state (current
    question, timer, score).
-   **localStorage** → stores high scores persistently across sessions.
-   **Framer Motion** → adds animations for better UX (timer blink,
    trophy bounce).
-   **TailwindCSS** → ensures a modern, responsive UI with minimal CSS.

------------------------------------------------------------------------

## 📌 Commands

-   `npm run dev` → Start dev server\
-   `npm run build` → Build production app\
-   `npm run preview` → Preview production build

------------------------------------------------------------------------

## 🏆 High Scores System

-   Stores top **10 scores** in localStorage
-   Ranks based on **percentage first**, then raw score
-   Shows **Gold, Silver, Bronze medals** for top 3

------------------------------------------------------------------------

## 👨‍💻 Author

**Your Name**\
[GitHub](https://github.com/navneetKushwaha-0N/-quiz-app.git)
[LinkedIn](https://www.linkedin.com/in/navneet--kushwaha/)

------------------------------------------------------------------------


