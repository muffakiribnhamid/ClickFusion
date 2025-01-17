import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Welcome = () => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [animationState, setAnimationState] = useState('idle')
  const [buttonScale, setButtonScale] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => prev === 'idle' ? 'active' : 'idle')
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    setButtonScale(1.1)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setButtonScale(1)
  }

  const handleStartClick = () => {
    setButtonScale(0.95)
    setTimeout(() => {
      setButtonScale(1)
      navigate('/question/1')
    }, 150)
  }

  const renderFeatureItem = (emoji, text) => (
    <div 
      className="hover:scale-110 transition-transform cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-3xl group-hover:animate-bounce inline-block">{emoji}</span>
      <span className="ml-2 group-hover:text-white transition-colors">{text}</span>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1f1c2c] to-[#928DAB] flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 w-full h-full">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] 
            bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] opacity-20 blur-[120px] rounded-full
            ${animationState === 'active' ? 'scale-110' : 'scale-100'} transition-transform duration-1000`}
        />
      </div>

      <div className="relative z-10 text-center space-y-12 w-full max-w-4xl mx-auto px-4">
        <div 
          className={`text-8xl transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${animationState === 'active' ? 'animate-bounce-slow' : ''}`}
        >
          🎮
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF416C] to-[#FF4B2B]
            hover:from-[#FF4B2B] hover:to-[#FF416C] transition-all duration-500">
            Bio Generator
          </h1>
          <p className="text-2xl text-gray-300 opacity-80">
            Level up your social game with AI-powered bios
          </p>
        </div>

        <div className="flex gap-12 justify-center text-2xl text-[#FF416C]">
          {renderFeatureItem('🎯', '4 Questions')}
          {renderFeatureItem('🤖', 'AI-Powered')}
          {renderFeatureItem('🔥', 'Gen-Z Ready')}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleStartClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `scale(${buttonScale})` }}
            className="px-12 py-5 bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white text-2xl font-bold rounded-full
              transition-all duration-300 shadow-lg shadow-[#FF416C]/50 cursor-pointer hover:shadow-xl
              hover:shadow-[#FF416C]/60 active:shadow-[#FF416C]/40"
          >
            Start Your Journey →
          </button>
          <span className="text-gray-400 text-sm">
            {isHovered ? 'Click to begin!' : 'Hover to interact'}
          </span>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
          Press any key to continue...
        </div>
      </div>
    </div>
  )
}

export default Welcome
