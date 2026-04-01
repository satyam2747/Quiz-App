

import { createContext, useContext, useReducer } from "react"

// ---------------- Create Context ----------------
const QuizContext = createContext()

// ---------------- Initial State ----------------
const initialState = {
  questions: [], // quiz questions fetched from API/local data
  currentQuestionIndex: 0, // index of the current question
  userAnswers: [], // stores user's answers (same length as questions array)
  score: 0, // total correct answers
  isQuizStarted: false, // whether quiz has started
  isQuizFinished: false, // whether quiz is completed
  timeLeft: 30, // countdown timer per question (in seconds)
  isTimerActive: false, // controls whether timer should run
  loading: false, // loading state for fetching questions
  error: null, // error state if fetching fails
}

// ---------------- Reducer ----------------
// Handles all quiz actions (state transitions)
function quizReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.payload,
        loading: false,
        // initialize answers array with null (no answer yet)
        userAnswers: new Array(action.payload.length).fill(null),
      }

    case "START_QUIZ":
      return {
        ...state,
        isQuizStarted: true,
        isTimerActive: true,
        timeLeft: 30, // reset timer when quiz starts
      }

    case "ANSWER_QUESTION":
      // Save user's answer for the current question
      const newAnswers = [...state.userAnswers]
      newAnswers[state.currentQuestionIndex] = action.payload
      return {
        ...state,
        userAnswers: newAnswers,
        isTimerActive: false, // stop timer after answering
      }

    case "NEXT_QUESTION":
      // Move to next question and restart timer
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        isTimerActive: true,
        timeLeft: 30,
      }

    case "PREVIOUS_QUESTION":
      // Go back to previous question
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
        isTimerActive: false,
      }

    case "FINISH_QUIZ":
      // Calculate score based on correct answers
      const score = state.userAnswers.reduce((acc, answer, index) => {
        return answer === state.questions[index].correct_answer ? acc + 1 : acc
      }, 0)
      return {
        ...state,
        isQuizFinished: true,
        score,
        isTimerActive: false,
      }

    case "RESTART_QUIZ":
      // Restart quiz but keep the same set of questions
      return {
        ...initialState,
        questions: state.questions,
      }

    case "TICK_TIMER":
      // If timer runs out
      if (state.timeLeft <= 1) {
        const newAnswers = [...state.userAnswers]
        // If unanswered, mark as "skipped" with empty string
        if (newAnswers[state.currentQuestionIndex] === null) {
          newAnswers[state.currentQuestionIndex] = ""
        }
        return {
          ...state,
          timeLeft: 0,
          isTimerActive: false,
          userAnswers: newAnswers,
        }
      }
      // Decrease timer by 1 second
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      }

    case "RESET_TIMER":
      // Reset timer when moving to next question
      return {
        ...state,
        timeLeft: 30,
        isTimerActive: true,
      }

    default:
      return state
  }
}

// ---------------- Provider ----------------
// Wraps app in QuizContext so all components can access state
export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>
}

// ---------------- Hook ----------------
// Custom hook to use QuizContext
export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
