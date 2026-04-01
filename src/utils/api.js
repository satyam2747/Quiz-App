// ---------------- Fallback questions ----------------
// Used when API fails, rate limits, or is unavailable
const fallbackQuestions = [
  {
    question: "Which data structure is used in a recursive function call?",
    correct_answer: "Stack",
    incorrect_answers: ["Queue", "Heap", "Linked List"],
    options: ["Stack", "Queue", "Heap", "Linked List"],
  },
  {
    question: "In DBMS, which normal form eliminates partial dependency?",
    correct_answer: "Second Normal Form (2NF)",
    incorrect_answers: ["First Normal Form (1NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
    options: [
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)",
    ],
  },
  {
    question: "Which scheduling algorithm may cause the problem of starvation?",
    correct_answer: "Shortest Job Next (SJN)",
    incorrect_answers: ["First Come First Serve (FCFS)", "Round Robin (RR)", "Priority Scheduling with Aging"],
    options: ["Shortest Job Next (SJN)", "First Come First Serve (FCFS)", "Round Robin (RR)", "Priority Scheduling with Aging"],
  },
  {
    question: "In computer networks, which layer is responsible for reliable data transfer?",
    correct_answer: "Transport Layer",
    incorrect_answers: ["Network Layer", "Session Layer", "Data Link Layer"],
    options: ["Transport Layer", "Network Layer", "Session Layer", "Data Link Layer"],
  },
  {
    question: "Which of the following has the fastest access time?",
    correct_answer: "Cache Memory",
    incorrect_answers: ["Virtual Memory", "Main Memory", "Secondary Storage"],
    options: ["Cache Memory", "Virtual Memory", "Main Memory", "Secondary Storage"],
  },
  {
    question: "Time complexity of searching in a balanced Binary Search Tree (BST) is?",
    correct_answer: "O(log n)",
    incorrect_answers: ["O(1)", "O(n)", "O(n log n)"],
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
  },
  {
    question: "Which protocol is used for secure communication over the internet?",
    correct_answer: "HTTPS",
    incorrect_answers: ["FTP", "HTTP", "SMTP"],
    options: ["HTTPS", "FTP", "HTTP", "SMTP"],
  },
  {
    question: "Which of the following is NOT a type of operating system?",
    correct_answer: "Compiler-based OS",
    incorrect_answers: ["Batch OS", "Real-Time OS", "Distributed OS"],
    options: ["Batch OS", "Real-Time OS", "Distributed OS", "Compiler-based OS"],
  },
  {
    question: "In C programming, which operator is used to access the value at an address?",
    correct_answer: "Dereference (*) operator",
    incorrect_answers: ["& (Address-of)", "-> (Arrow)", ". (Dot)"],
    options: ["Dereference (*) operator", "& (Address-of)", "-> (Arrow)", ". (Dot)"],
  },
  {
    question: "Which algorithm is used in public key cryptography?",
    correct_answer: "RSA",
    incorrect_answers: ["DES", "AES", "SHA-256"],
    options: ["RSA", "DES", "AES", "SHA-256"],
  },
]

// ---------------- Utility Functions ----------------

// Shuffle options array (Fisher–Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Decode HTML entities (e.g., &quot; → ")
function decodeHtml(html) {
  const txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

// ---------------- API Handling ----------------

let cachedQuestions = null // cache last questions to reduce API calls
let lastApiCall = 0 // timestamp of last API request
const API_COOLDOWN = 5000 // 5 seconds between calls (avoid rate-limit)

// Fetch questions (API → fallback)
export async function fetchQuestions() {
  try {
    const now = Date.now()

    // Use cached questions if within cooldown
    if (cachedQuestions && now - lastApiCall < API_COOLDOWN) {
      console.log("[v0] Using cached questions to avoid rate limiting")
      return shuffleArray(cachedQuestions).slice(0, 8)
    }

    // If cooldown active but no cache → fallback
    if (now - lastApiCall < API_COOLDOWN) {
      console.log("[v0] API cooldown active, using fallback questions")
      return shuffleArray(fallbackQuestions).slice(0, 8)
    }

    // Update last API call time
    lastApiCall = now

    // Request from Open Trivia DB API
    const response = await fetch("https://opentdb.com/api.php?amount=8&type=multiple")

    // Handle API rate limit
    if (response.status === 429) {
      console.log("[v0] API rate limit reached, using fallback questions")
      return shuffleArray(fallbackQuestions).slice(0, 8)
    }

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.response_code !== 0) {
      throw new Error(`API returned error code: ${data.response_code}`)
    }

    // Process & clean API questions
    const processedQuestions = data.results.map((question) => ({
      question: decodeHtml(question.question),
      correct_answer: decodeHtml(question.correct_answer),
      incorrect_answers: question.incorrect_answers.map(decodeHtml),
      options: shuffleArray([decodeHtml(question.correct_answer), ...question.incorrect_answers.map(decodeHtml)]),
    }))

    // Cache for next call
    cachedQuestions = processedQuestions
    console.log("[v0] Successfully fetched questions from API")

    return processedQuestions
  } catch (error) {
    if (error.message.includes("429") || error.message.includes("rate limit")) {
      console.log("[v0] API rate limited, using fallback questions")
    } else {
      console.log("[v0] API unavailable, using fallback questions:", error.message)
    }

    // Always provide fallback if API fails
    return shuffleArray(fallbackQuestions).slice(0, 8)
  }
}
