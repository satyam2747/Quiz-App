"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaTrophy, FaHome, FaRedo, FaCheck, FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import { useQuiz } from "../context/QuizContext"
import { saveHighScore } from "../utils/localStorage"

function Results() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuiz()

  // Redirect to home if quiz not finished
  useEffect(() => {
    if (!state.isQuizFinished) {
      navigate("/")
      return
    }

    // Save high score in local storage after quiz completion
    const percentage = Math.round((state.score / state.questions.length) * 100)
    saveHighScore({
      score: state.score,
      total: state.questions.length,
      percentage,
      date: new Date().toISOString(),
    })
  }, [state.isQuizFinished, state.score, state.questions.length, navigate])

  if (!state.isQuizFinished) return null

  const percentage = Math.round((state.score / state.questions.length) * 100)

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    if (percentage >= 90) return "Excellent! 🎉"
    if (percentage >= 80) return "Great job! 👏"
    if (percentage >= 70) return "Good work! 👍"
    if (percentage >= 60) return "Not bad! 😊"
    return "Keep practicing! 💪"
  }

  const handleRestart = () => {
    dispatch({ type: "RESTART_QUIZ" })
    navigate("/quiz")
  }

  const handleHome = () => {
    dispatch({ type: "RESTART_QUIZ" })
    navigate("/")
  }

  const handleViewHighScores = () => {
    navigate("/high-scores")
  }

  return (
    <motion.div
      className="min-h-screen p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 text-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
            >
              <FaTrophy className="text-7xl mx-auto mb-4 drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 drop-shadow-sm">Quiz Complete!</h1>
            <p className="text-xl opacity-90">{getScoreMessage()}</p>
          </div>

          {/* Score Section */}
          <div className="p-10 text-center border-b bg-gray-50">
            <motion.div
              className={`text-6xl font-extrabold mb-4 ${getScoreColor()}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              {state.score}/{state.questions.length}
            </motion.div>
            <div className={`text-2xl font-semibold ${getScoreColor()}`}>
              {percentage}% Correct
            </div>
          </div>

          {/* Question Summary Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Summary</h2>
            <div className="space-y-4">
              {state.questions.map((question, index) => {
                const userAnswer = state.userAnswers[index]
                const isCorrect = userAnswer === question.correct_answer
                const wasSkipped = userAnswer === ""

                return (
                  <motion.div
                    key={index}
                    className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow ${
                          isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isCorrect ? <FaCheck /> : <FaTimes />}
                      </div>

                      {/* Question & Answers */}
                      <div className="flex-1">
                        <h3
                          className="font-medium text-gray-800 mb-2"
                          dangerouslySetInnerHTML={{ __html: `${index + 1}. ${question.question}` }}
                        />
                        <div className="space-y-1 text-sm">
                          {/* User's Answer */}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600">Your answer:</span>
                            <span
                              className={`${
                                wasSkipped
                                  ? "text-gray-500 italic"
                                  : isCorrect
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }`}
                            >
                              {wasSkipped ? "Skipped" : userAnswer}
                            </span>
                          </div>

                          {/* Correct Answer (if wrong) */}
                          {!isCorrect && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-600">Correct answer:</span>
                              <span className="text-green-600 font-medium">{question.correct_answer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-gray-100 flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md transition-transform hover:scale-105"
            >
              <FaRedo />
              Restart Quiz
            </button>
            <button
              onClick={handleViewHighScores}
              className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center gap-2 shadow-md transition-transform hover:scale-105"
            >
              <FaTrophy />
              High Scores
            </button>
            <button
              onClick={handleHome}
              className="px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 shadow-md transition-transform hover:scale-105"
            >
              <FaHome />
              Home
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Results
