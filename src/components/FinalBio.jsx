import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateBio } from '../services/gemini'

const FinalBio = ({ userAnswers }) => {
  const navigate = useNavigate()
  const [copied, setCopied] = useState({ long: false, short: false })
  const [buttonScales, setButtonScales] = useState({ long: 1, short: 1, restart: 1 })
  const [showCopiedMessage, setShowCopiedMessage] = useState({ long: false, short: false })
  const [isLoading, setIsLoading] = useState(true)
  const [loadingDots, setLoadingDots] = useState('')
  const [bioRevealProgress, setBioRevealProgress] = useState({ long: 0, short: 0 })
  const [bios, setBios] = useState({ longBio: '', shortBio: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const generateBios = async () => {
      try {
        const { longBio, shortBio } = await generateBio(userAnswers)
        setBios({ longBio, shortBio })
        setIsLoading(false)
        startBioReveal()
      } catch (err) {
        setError('Failed to generate bio. Please try again.')
        setIsLoading(false)
      }
    }

    generateBios()
  }, [userAnswers])

  const startBioReveal = () => {
    const revealDuration = 1500
    const steps = 20
    const stepDuration = revealDuration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = (currentStep / steps) * 100
      setBioRevealProgress({ long: progress, short: progress })

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)
  }

  const handleCopy = async (type, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [type]: true }))
      setShowCopiedMessage(prev => ({ ...prev, [type]: true }))
      setButtonScales(prev => ({ ...prev, [type]: 0.95 }))
      
      setTimeout(() => {
        setButtonScales(prev => ({ ...prev, [type]: 1 }))
        setCopied(prev => ({ ...prev, [type]: false }))
      }, 150)

      setTimeout(() => {
        setShowCopiedMessage(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleRestart = () => {
    setButtonScales(prev => ({ ...prev, restart: 0.95 }))
    setTimeout(() => {
      setButtonScales(prev => ({ ...prev, restart: 1 }))
      navigate('/')
    }, 150)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleRestart}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          style={{ transform: `scale(${buttonScales.restart})` }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-600 to-purple-600">
      {isLoading ? (
        <div className="text-3xl font-bold text-white animate-pulse">
          Crafting your bio{loadingDots}
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Your Professional Bio</h2>
            
            {/* Long Bio */}
            <div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-2xl">
              <div 
                className="text-gray-800 text-lg leading-relaxed"
                style={{ opacity: bioRevealProgress.long / 100 }}
              >
                {bios.longBio}
              </div>
              <button
                onClick={() => handleCopy('long', bios.longBio)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                style={{ transform: `scale(${buttonScales.long})` }}
              >
                {copied.long ? '✓ Copied!' : 'Copy Bio'}
              </button>
              {showCopiedMessage.long && (
                <span className="ml-2 text-green-500 animate-fade-out">
                  Copied to clipboard!
                </span>
              )}
            </div>

            {/* Short Bio */}
            <div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">One-Liner</h3>
              <div 
                className="text-gray-800 text-lg"
                style={{ opacity: bioRevealProgress.short / 100 }}
              >
                {bios.shortBio}
              </div>
              <button
                onClick={() => handleCopy('short', bios.shortBio)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                style={{ transform: `scale(${buttonScales.short})` }}
              >
                {copied.short ? '✓ Copied!' : 'Copy One-Liner'}
              </button>
              {showCopiedMessage.short && (
                <span className="ml-2 text-green-500 animate-fade-out">
                  Copied to clipboard!
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg 
              hover:bg-blue-50 transition-all transform hover:scale-105"
            style={{ transform: `scale(${buttonScales.restart})` }}
          >
            Create Another Bio
          </button>
        </div>
      )}
    </div>
  )
}

export default FinalBio
