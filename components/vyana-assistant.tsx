'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VyanaAssistantProps {
    onTranscript: (text: string) => void
    onGenerate: (text: string) => void
}

export default function VyanaAssistant({ onTranscript, onGenerate }: VyanaAssistantProps) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const recognitionRef = useRef<any>(null)
    const isActuallyListening = useRef(false)
    const isManualStopRef = useRef(false)
    const isAutoRestarting = useRef(false)
    const lastEmittedSegmentRef = useRef('')
    const processedTranscriptRef = useRef('')
    const voicesLoaded = useRef(false)
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Use refs for callbacks to prevent useEffect from re-running
    const onTranscriptRef = useRef(onTranscript)
    const onGenerateRef = useRef(onGenerate)

    useEffect(() => {
        onTranscriptRef.current = onTranscript
        onGenerateRef.current = onGenerate
    }, [onTranscript, onGenerate])

    const stopListening = useCallback(() => {
        isManualStopRef.current = true
        if (recognitionRef.current && isActuallyListening.current) {
            recognitionRef.current.stop()
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }
        if (window.speechSynthesis && isActuallyListening.current) {
            // Only cancel if we are explicitly stopping a session, 
            // but we'll let existing generation-cues finish.
            // Actually, usually we only want to cancel when switching the mic OFF manually.
        }
    }, [])

    const resetSilenceTimer = useCallback(() => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
        }
        silenceTimeoutRef.current = setTimeout(() => {
            if (isActuallyListening.current) {
                console.log('Vyana silence timeout reached...')
                stopListening()
                speak("Understood. I am building it for you now.")
                setTimeout(() => {
                    onGenerateRef.current('')
                }, 1500) // Slightly longer to allow speech to start
            }
        }, 7000) // Increased to 7 seconds for better UX
    }, [stopListening])

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition()
            recognitionInstance.continuous = true
            recognitionInstance.interimResults = true
            recognitionInstance.lang = 'en-US'

            recognitionInstance.onstart = () => {
                isActuallyListening.current = true
                isManualStopRef.current = false

                // Only reset the visual state and transcript if it's a NEW session
                if (!isAutoRestarting.current) {
                    processedTranscriptRef.current = ''
                    lastEmittedSegmentRef.current = ''
                    setIsListening(true)
                }

                isAutoRestarting.current = false
                resetSilenceTimer()
            }

            recognitionInstance.onresult = (event: any) => {
                // Clear existing silence timer to prevent double triggers
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current)
                }

                let transcript = ""

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript
                    }
                }

                if (transcript) {
                    const trimmedTranscript = transcript.trim()
                    // Prevention: Only skip if it's IDENTICAL to the last emitted chunk 
                    // (prevents browser double-reporting on mobile)
                    if (trimmedTranscript !== lastEmittedSegmentRef.current) {
                        onTranscriptRef.current(trimmedTranscript)
                        lastEmittedSegmentRef.current = trimmedTranscript
                        processedTranscriptRef.current = (processedTranscriptRef.current + " " + trimmedTranscript).trim()
                    }
                }

                // Reset silence timer
                resetSilenceTimer()

                // Keyword detection on the accumulated transcript
                const lowerFull = processedTranscriptRef.current.toLowerCase()
                const triggers = ['generate', 'build it', 'create it']
                if (triggers.some(t => lowerFull.includes(t))) {
                    const cleanPrompt = lowerFull.replace(/generate|build it|create it/gi, '').trim()
                    onGenerateRef.current(cleanPrompt)
                    speak("Understood. I am building it for you now.")
                    stopListening()
                }
            }

            recognitionInstance.onerror = (event: any) => {
                if (event.error === 'aborted') return
                console.error('Vyana hearing error:', event.error)
                setIsListening(false)
                isActuallyListening.current = false
                if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
            }

            recognitionInstance.onend = () => {
                // If it's NOT a manual stop and we still have a silence timer pending,
                // the browser just "timed out" or dropped the connection. Restart it quietly.
                if (!isManualStopRef.current && silenceTimeoutRef.current) {
                    console.log('Voice dropout detected, auto-restarting session...')
                    isAutoRestarting.current = true
                    try {
                        recognitionInstance.start()
                        return
                    } catch (e) {
                        console.error("Failed to auto-restart recognition:", e)
                    }
                }

                setIsListening(false)
                isActuallyListening.current = false
                isManualStopRef.current = false
                isAutoRestarting.current = false
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current)
                    silenceTimeoutRef.current = null
                }
            }

            recognitionRef.current = recognitionInstance
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.getVoices()
            window.speechSynthesis.onvoiceschanged = () => {
                voicesLoaded.current = true
            }
        }

        return () => {
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
        }
    }, [resetSilenceTimer, stopListening])

    const speak = (text: string, onDone?: () => void) => {
        if (!window.speechSynthesis) return

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)

        // Highly prioritized list for a "beautiful, clear, futuristic" feminine voice
        const voices = window.speechSynthesis.getVoices()
        const priorityPatterns = [
            'Google UK English Female',
            'Google US English Female',
            'Microsoft Aria Online (Natural)',
            'Microsoft Jenny Online (Natural)',
            'Microsoft Sonia Online (Natural)',
            'Samantha',
            'Victoria',
            'Apple Moira', // Mobile fallback
            'Apple Karen',  // Mobile fallback
            'English (United Kingdom)-en-GB-Standard-A', // Common mobile voice
            'Microsoft Zira'
        ]

        let selectedVoice = null

        // Try to find the first matching voice in the priority list
        for (const pattern of priorityPatterns) {
            selectedVoice = voices.find(v => v.name.includes(pattern))
            if (selectedVoice) break
        }

        // Fallback: search for any "female" or "feminine" high-quality or natural voice
        if (!selectedVoice) {
            selectedVoice = voices.find(v =>
                (v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('woman') ||
                    v.name.toLowerCase().includes('natural') ||
                    v.name.toLowerCase().includes('girl')) &&
                !v.name.toLowerCase().includes('male')
            )
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice
        }

        // ─────────────────────────────────────────────────────────────
        // "FUTURISTIC" TUNING
        // ─────────────────────────────────────────────────────────────
        utterance.pitch = 1.25
        utterance.rate = 1.05
        utterance.volume = 1.0

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
            setIsSpeaking(false)
            if (onDone) onDone()
        }
        utterance.onerror = () => {
            setIsSpeaking(false)
            if (onDone) onDone()
        }

        window.speechSynthesis.speak(utterance)
    }

    const startListening = () => {
        if (!isActuallyListening.current) {
            // First speak the greeting, then start the recognition in the callback
            speak("Hi, I'm Vyana. What are we building today?", () => {
                if (recognitionRef.current && !isActuallyListening.current) {
                    try {
                        recognitionRef.current.start()
                    } catch (e) {
                        console.error("Failed to start recognition:", e)
                    }
                }
            })
        }
    }


    const toggleListening = () => {
        if (isListening || isSpeaking) {
            stopListening()
        } else {
            startListening()
        }
    }

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-accent rounded-full blur-md"
                        />
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleListening}
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isListening
                        ? 'bg-accent text-background shadow-[0_0_20px_rgba(0,255,65,0.5)]'
                        : 'bg-card border border-border hover:border-accent/50 text-foreground'
                        }`}
                    title={isListening ? "Stop listening" : "Talk to Vyana"}
                >
                    {isListening ? (
                        <Mic className="w-5 h-5 animate-pulse" />
                    ) : (
                        <MicOff className="w-5 h-5 opacity-60" />
                    )}
                </button>
            </div>

            <AnimatePresence>
                {(isListening || isSpeaking) && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20"
                    >
                        <div className="flex gap-0.5">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: isListening || isSpeaking ? [4, 12, 4] : 4 }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                    className="w-1 bg-accent rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent italic">
                            Vyana {isSpeaking ? 'Speaking' : 'Listening'}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
