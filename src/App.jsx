import { Routes, Route } from "react-router-dom"
import { QuizProvider } from "./context/QuizContext"
import Home from "./components/Home"
import Quiz from "./components/Quiz"
import Results from "./components/Results"
import HighScores from "./components/HighScores"

function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/high-scores" element={<HighScores />} />
        </Routes>
      </div>
    </QuizProvider>
  )
}

export default App
