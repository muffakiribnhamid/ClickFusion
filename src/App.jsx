import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Welcome from './components/Welcome'
import QuestionPage from './components/QuestionPage'
import FinalBio from './components/FinalBio'

function App() {
  const [userAnswers, setUserAnswers] = useState({})

  const questions = [
    {
      id: 1,
      question: "What's your vibe? ",
      field: "vibe",
      options: [
        "Chaotic Good (Living life on the edge)",
        "Chill AF (Zero drama, maximum peace)",
        "Main Character Energy (It's my world)",
        "Meme Lord (Born to be viral)"
      ]
    },
    {
      id: 2,
      question: "Pick your digital weapon! ",
      field: "platform",
      options: [
        "TikTok (Short-form king/queen)",
        "Instagram (Aesthetic is life)",
        "Twitter/X (Hot takes for days)",
        "YouTube (Content connoisseur)"
      ]
    },
    {
      id: 3,
      question: "Your superpower would be... ",
      field: "superpower",
      options: [
        "Time manipulation (for extra TikTok time)",
        "Mind reading (to know the trending topics)",
        "Teleportation (perfect selfie locations)",
        "Invisibility (lurking mode activated)"
      ]
    },
    {
      id: 4,
      question: "Your dream hangout spot? ",
      field: "hangout",
      options: [
        "Aesthetic cafe with overpriced coffee",
        "Gaming setup with RGB everything",
        "Rooftop vibes with city views",
        "Anywhere with good Wi-Fi tbh"
      ]
    }
  ]

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {questions.map((q) => (
          <Route
            key={q.id}
            path={`/question/${q.id}`}
            element={
              <QuestionPage
                question={q}
                totalQuestions={questions.length}
                setUserAnswers={setUserAnswers}
                userAnswers={userAnswers}
              />
            }
          />
        ))}
        <Route path="/name" element={
          <QuestionPage
            question={{
              id: questions.length + 1,
              question: "Finally, what's your name? (optional) ",
              field: "name",
              isOptional: true
            }}
            totalQuestions={questions.length + 1}
            setUserAnswers={setUserAnswers}
            userAnswers={userAnswers}
          />
        } />
        <Route path="/final" element={<FinalBio userAnswers={userAnswers} />} />
      </Routes>
    </Router>
  )
}

export default App
