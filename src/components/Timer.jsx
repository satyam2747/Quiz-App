

import { useEffect } from "react"
import { FaClock } from "react-icons/fa"
import { motion } from "framer-motion"
import { useQuiz } from "../context/QuizContext"

function Timer() {
  const { state, dispatch } = useQuiz()

  // ---------------- Timer Countdown ----------------
  // This effect runs a countdown using setInterval when:
  // - The timer is active
  // - Time left is greater than 0
  // Every second, it dispatches "TICK_TIMER" to reduce timeLeft by 1.
  useEffect(() => {
    let interval = null

    if (state.isTimerActive && state.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: "TICK_TIMER" })
      }, 1000)
    }

    // Cleanup: clear the interval when component unmounts
    // or dependencies (timeLeft, isTimerActive) change
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isTimerActive, state.timeLeft, dispatch])

  // ---------------- Reset Timer on Next Question ----------------
  // When the quiz is ongoing and user moves to the next question,
  // we reset the timer for the new question.
  useEffect(() => {
    if (state.isQuizStarted && !state.isQuizFinished) {
      dispatch({ type: "RESET_TIMER" }) // reducer must handle this action
    }
  }, [state.currentQuestionIndex, state.isQuizStarted, state.isQuizFinished, dispatch])

  // ---------------- Timer Color Logic ----------------
  // Change timer text color based on urgency:
  // - Red: <= 5 seconds
  // - Yellow: <= 10 seconds
  // - White: otherwise
  const getTimerColor = () => {
    if (state.timeLeft <= 5) return "text-red-500"
    if (state.timeLeft <= 10) return "text-yellow-400"
    return "text-white"
  }

  return (
    <motion.div
      className={`flex items-center gap-2 ${getTimerColor()}`}
      animate={
        state.timeLeft <= 5
          ? { opacity: [1, 0.3, 1] } // blink animation in last 5 seconds
          : { opacity: 1 }
      }
      transition={{
        duration: 0.8,
        repeat: state.timeLeft <= 5 ? Infinity : 0,
      }}
    >
      {/* Timer Icon */}
      <FaClock />
      {/* Display timer in mm:ss format */}
      <span className="font-mono text-lg font-semibold">
        {String(Math.floor(state.timeLeft / 60)).padStart(2, "0")}:
        {String(state.timeLeft % 60).padStart(2, "0")}
      </span>
    </motion.div>
  )
}

export default Timer
