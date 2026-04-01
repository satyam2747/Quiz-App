// Key used for storing high scores in localStorage
const HIGH_SCORES_KEY = "quiz-high-scores"

// Maximum number of high scores to keep
const MAX_SCORES = 10

// -----------------------------
// Fetch all high scores from localStorage
// -----------------------------
export function getHighScores() {
  try {
    // Read data from localStorage
    const scores = localStorage.getItem(HIGH_SCORES_KEY)

    // If scores exist, parse JSON, otherwise return empty array
    return scores ? JSON.parse(scores) : []
  } catch (error) {
    console.error("Error reading high scores:", error)
    return []
  }
}

// -----------------------------
// Save a new high score to localStorage
// -----------------------------
export function saveHighScore(newScore) {
  try {
    // Get existing scores
    const scores = getHighScores()

    // Add the new score
    scores.push(newScore)

    // Sort scores:
    // 1. By percentage (higher first)
    // 2. If percentage is same → by score (higher first)
    scores.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage
      }
      return b.score - a.score
    })

    // Keep only top N scores (e.g., top 10)
    const topScores = scores.slice(0, MAX_SCORES)

    // Save updated scores list back to localStorage
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores))

    // Return the updated top scores
    return topScores
  } catch (error) {
    console.error("Error saving high score:", error)

    // In case of error, return existing scores
    return getHighScores()
  }
}

// -----------------------------
// Clear all high scores from localStorage
// -----------------------------
export function clearHighScores() {
  try {
    // Remove scores data
    localStorage.removeItem(HIGH_SCORES_KEY)
  } catch (error) {
    console.error("Error clearing high scores:", error)
  }
}
