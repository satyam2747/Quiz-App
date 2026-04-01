

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa"
import { useQuiz } from "../context/QuizContext"
import ProgressBar from "./ProgressBar"
import Timer from "./Timer"
import { motion, AnimatePresence } from "framer-motion"

function Quiz() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuiz()

  // Redirect back to home if quiz not started or no questions loaded
  useEffect(() => {
    if (!state.isQuizStarted || state.questions.length === 0) {
      navigate("/")
    }
  }, [state.isQuizStarted, state.questions.length, navigate])

  // Redirect to results page when quiz finishes
  useEffect(() => {
    if (state.isQuizFinished) {
      navigate("/results")
    }
  }, [state.isQuizFinished, navigate])

  // If quiz not started, render nothing
  if (!state.isQuizStarted || state.questions.length === 0) {
    return null
  }

  // Current question & state variables
  const currentQuestion = state.questions[state.currentQuestionIndex]
  const currentAnswer = state.userAnswers[state.currentQuestionIndex]
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1
  const canGoNext = currentAnswer !== null
  const canGoPrevious = state.currentQuestionIndex > 0

  // Select answer handler
  const handleAnswerSelect = (answer) => {
    dispatch({ type: "ANSWER_QUESTION", payload: answer })
  }

  // Go to next question OR finish quiz
  const handleNext = () => {
    if (isLastQuestion) {
      dispatch({ type: "FINISH_QUIZ" })
    } else {
      dispatch({ type: "NEXT_QUESTION" })
    }
  }

  // Go back to previous question
  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_QUESTION" })
  }

  // Skip question (store empty answer and move forward)
  const handleSkip = () => {
    if (currentAnswer === null) {
      dispatch({ type: "ANSWER_QUESTION", payload: "" })
    }
    setTimeout(() => {
      handleNext()
    }, 100)
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header Section: Title, Timer & Progress Bar */}
          <div className="bg-indigo-600 text-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold">Quiz in Progress</h1>
              <Timer />
            </div>
            <ProgressBar current={state.currentQuestionIndex + 1} total={state.questions.length} />
          </div>

          {/* Question Section */}
          <div className="p-4 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Current Question */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Question {state.currentQuestionIndex + 1} of {state.questions.length}
                  </h2>
                  <p
                    className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                  />
                </div>

                {/* Answer Options */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 sm:mb-10"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className={`w-full px-4 py-3 rounded-lg border text-left transition-all duration-200 text-sm sm:text-base
                        ${
                          currentAnswer === option
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-indigo-50"
                        }`}
                      disabled={state.timeLeft === 0 && currentAnswer === null}
                    >
                      <span dangerouslySetInnerHTML={{ __html: option }} />
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Previous Button */}
              <motion.button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                whileHover={{ scale: canGoPrevious ? 1.05 : 1 }}
                whileTap={{ scale: canGoPrevious ? 0.95 : 1 }}
                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg border transition-all duration-200
                  ${
                    canGoPrevious
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <FaArrowLeft />
                Previous
              </motion.button>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Skip Button */}
                <motion.button
                  onClick={handleSkip}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-lg border bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all"
                  disabled={state.timeLeft === 0}
                >
                  Skip
                </motion.button>

                {/* Next / Finish Button */}
                <motion.button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  whileHover={{ scale: canGoNext ? 1.05 : 1 }}
                  whileTap={{ scale: canGoNext ? 0.95 : 1 }}
                  className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white transition-all duration-200
                    ${
                      canGoNext
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                        : "bg-indigo-300 cursor-not-allowed"
                    }`}
                >
                  {isLastQuestion ? (
                    <>
                      <FaCheck />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Quiz  
