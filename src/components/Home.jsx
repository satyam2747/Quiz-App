
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlay, FaTrophy, FaBrain } from "react-icons/fa"
import { useQuiz } from "../context/QuizContext"
import { fetchQuestions } from "../utils/api"
import { motion } from "framer-motion"

function Home() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuiz()

  // Load questions when component mounts
  useEffect(() => {
    loadQuestions()
  }, [])

  // Fetch quiz questions from API
  const loadQuestions = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const questions = await fetchQuestions()
      dispatch({ type: "SET_QUESTIONS", payload: questions })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load questions. Please try again." })
    }
  }

  // Start quiz if questions are available
  const startQuiz = () => {
    if (state.questions.length > 0) {
      dispatch({ type: "START_QUIZ" })
      navigate("/quiz")
    }
  }

  // Navigate to High Scores page
  const viewHighScores = () => {
    navigate("/high-scores")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center px-4 sm:px-6 py-8">
      <motion.div
        className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-10 text-center border border-gray-100"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* ---------- Header / Logo Section ---------- */}
        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FaBrain className="text-6xl sm:text-7xl text-indigo-600 mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
            Quiz Master
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
            Test your knowledge with our interactive quiz!
          </p>
        </motion.div>

        {/* ---------- Loading State ---------- */}
        {state.loading && (
          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">Loading questions...</p>
          </motion.div>
        )}

        {/* ---------- Error State ---------- */}
        {state.error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-600 text-sm sm:text-base">{state.error}</p>
            <button
              onClick={loadQuestions}
              className="mt-3 text-indigo-600 hover:underline font-medium text-sm sm:text-base"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* ---------- Main Actions (Start + High Scores) ---------- */}
        {!state.loading && !state.error && (
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-gray-700 mb-6 text-base sm:text-lg">
              Ready to challenge yourself? We have{" "}
              <span className="font-semibold text-indigo-600">{state.questions.length}</span> questions
              waiting for you!
            </p>

            {/* Start Quiz Button */}
            <motion.button
              onClick={startQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white text-base sm:text-lg font-semibold shadow-md transition-all 
                ${state.questions.length > 0 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-300 cursor-not-allowed"}`}
              disabled={state.questions.length === 0}
            >
              <FaPlay />
              Start Quiz
            </motion.button>

            {/* High Scores Button */}
            <motion.button
              onClick={viewHighScores}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 text-base sm:text-lg font-medium shadow-sm hover:bg-gray-100 transition-all"
            >
              <FaTrophy className="text-yellow-500" />
              High Scores
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Home
