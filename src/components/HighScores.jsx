import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaHome, FaTrophy, FaTrash, FaMedal } from "react-icons/fa"
import { getHighScores, clearHighScores } from "../utils/localStorage"
import { motion } from "framer-motion"

function HighScores() {
  const navigate = useNavigate()
  const [scores, setScores] = useState([])

  // Load high scores from localStorage on mount
  useEffect(() => {
    setScores(getHighScores())
  }, [])

  // Clear all high scores after confirmation
  const handleClearScores = () => {
    if (window.confirm("Are you sure you want to clear all high scores?")) {
      clearHighScores()
      setScores([])
    }
  }

  // Navigate back to Home page
  const handleHome = () => {
    navigate("/")
  }

  // Format stored date into readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Return medal icons for Top 3, otherwise rank number
  const getMedalIcon = (index) => {
    if (index === 0) return <FaMedal className="text-yellow-500 text-2xl drop-shadow-md" /> // Gold
    if (index === 1) return <FaMedal className="text-gray-400 text-2xl drop-shadow-md" />  // Silver
    if (index === 2) return <FaMedal className="text-amber-600 text-2xl drop-shadow-md" /> // Bronze
    return <span className="text-gray-500 font-semibold">#{index + 1}</span>     // Rank number
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* ---------- Header Section ---------- */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-10 text-center shadow-md">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaTrophy className="text-7xl mx-auto mb-4 drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-extrabold mb-2">High Scores</h1>
            <p className="text-lg opacity-90">Your best quiz performances</p>
          </div>

          {/* ---------- Scores List Section ---------- */}
          <div className="p-8">
            {scores.length === 0 ? (
              // If no scores available
              <div className="text-center py-16">
                <FaTrophy className="text-7xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">No scores yet!</h2>
                <p className="text-gray-500 mb-6">Take a quiz to see your scores here.</p>
                <button
                  onClick={handleHome}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
                >
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <>
                {/* Top Scores Heading + Clear Button */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Top {scores.length} Score{scores.length !== 1 ? "s" : ""}
                  </h2>
                  <button
                    onClick={handleClearScores}
                    className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm hover:scale-105 transition"
                  >
                    <FaTrash />
                    Clear All
                  </button>
                </div>

                {/* Scores List */}
                <div className="space-y-4">
                  {scores.map((score, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-5 bg-white rounded-xl border shadow-sm hover:shadow-md hover:bg-orange-50 transition"
                    >
                      {/* Left side: Medal + Score details */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getMedalIcon(index)}
                        </div>
                        <div>
                          {/* Score text */}
                          <div className="font-semibold text-lg text-gray-800">
                            {score.score}/{score.total} ({score.percentage}%)
                          </div>
                          {/* Date */}
                          <div className="text-sm text-gray-500">
                            {formatDate(score.date)}
                          </div>
                        </div>
                      </div>

                      {/* Right side: Colored percentage */}
                      <div
                        className={`text-2xl font-bold ${
                          score.percentage >= 80
                            ? "text-green-600"
                            : score.percentage >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {score.percentage}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ---------- Footer Actions ---------- */}
          <div className="p-6 bg-gray-50 flex justify-center">
            <button
              onClick={handleHome}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2"
            >
              <FaHome />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HighScores
