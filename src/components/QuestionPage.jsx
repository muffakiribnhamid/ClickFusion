import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const QuestionPage = ({ question, totalQuestions, setUserAnswers, userAnswers }) => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [buttonScale, setButtonScale] = useState(1)
  const [progressWidth, setProgressWidth] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [loadingDots, setLoadingDots] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth((question.id / totalQuestions) * 100)
    }, 100)
    return () => clearTimeout(timer)
  }, [question.id, totalQuestions])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleOptionSelect = (option) => {
    setIsAnimating(true)
    setSelectedOption(option)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleButtonHover = (isHovered) => {
    if (!selectedOption && !question.isOptional) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2000)
      return
    }
    setButtonScale(isHovered ? 1.1 : 1)
  }

  const handleNext = () => {
    if (!selectedOption && !question.isOptional) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setButtonScale(0.95)
    setTimeout(() => {
      setButtonScale(1)
      
      if (question.isOptional && !selectedOption) {
        setUserAnswers(prev => ({ ...prev, [question.field]: "Anonymous" }))
      } else {
        setUserAnswers(prev => ({ ...prev, [question.field]: selectedOption }))
      }
      
      if (question.id === totalQuestions) {
        navigate('/final')
      } else if (question.id === totalQuestions - 1) {
        navigate('/name')
      } else {
        navigate(`/question/${question.id + 1}`)
      }
    }, 150)
  }

  const getButtonText = () => {
    if (question.id === totalQuestions) {
      return `Generate Bio${loadingDots}`
    }
    return selectedOption ? 'Next →' : 'Choose an option'
  }

  const renderOption = (option, index) => (
    <button
      key={index}
      onClick={() => handleOptionSelect(option)}
      className={`w-full p-5 text-xl rounded-full transition-all duration-300 transform
        ${selectedOption === option 
          ? 'bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white scale-105 shadow-lg shadow-[#FF416C]/50' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-102'}
        ${isAnimating && selectedOption === option ? 'scale-95' : ''}`}
    >
      {option}
    </button>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1f1c2c] to-[#928DAB] flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] 
          bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] opacity-20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-[600px] text-center space-y-8">
        <div className="mb-12">
          <div className="text-[#FF416C] text-xl mb-3">
            Question {question.id} of {totalQuestions}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF416C] transition-all duration-1000 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-white">
          {question.question}
        </h2>

        <div className="space-y-4 mt-8">
          {question.options ? (
            question.options.map((option, index) => renderOption(option, index))
          ) : (
            <input
              type="text"
              placeholder={question.isOptional ? "Enter your name (or leave blank)" : "Type your answer..."}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full p-5 text-xl bg-gray-800 rounded-full text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#FF416C] transition-all duration-300
                hover:bg-gray-700"
            />
          )}
        </div>

        <div className="relative">
          {showHint && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-[#FF416C] text-sm">
              Please select an option first
            </div>
          )}
          <button
            onClick={handleNext}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
            style={{ transform: `scale(${buttonScale})` }}
            className={`mt-8 px-12 py-5 text-2xl font-bold rounded-full transition-all duration-300
              ${!selectedOption && !question.isOptional
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white shadow-lg shadow-[#FF416C]/50'}
              ${shake ? 'animate-shake' : ''}`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionPage
