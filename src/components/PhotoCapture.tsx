'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhotoCaptureProps {
  onCapture: (photos: string[]) => void
  maxPhotos?: number
}

export function PhotoCapture({ onCapture, maxPhotos = 3 }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [ring, setRing] = useState<'red' | 'amber' | 'green'>('red')
  const [ringMessage, setRingMessage] = useState('Move to better light')
  const [photos, setPhotos] = useState<string[]>([])
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    startCamera()
    return () => {
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  useEffect(() => {
    if (!stream) return

    const interval = setInterval(() => {
      checkLighting()
    }, 500)

    return () => clearInterval(interval)
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access denied:', err)
    }
  }

  const checkLighting = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let totalLuminance = 0

    for (let i = 0; i < frame.data.length; i += 4) {
      const r = frame.data[i]
      const g = frame.data[i + 1]
      const b = frame.data[i + 2]
      totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b
    }

    const avgLuminance = totalLuminance / (frame.data.length / 4)

    if (avgLuminance < 50) {
      setRing('red')
      setRingMessage('Move to better light')
    } else if (avgLuminance < 100) {
      setRing('amber')
      setRingMessage('A little better — try facing a window')
    } else {
      setRing('green')
      setRingMessage('Perfect — tap to capture')
    }
  }

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    setCapturing(true)
    const newPhotos: string[] = []

    const captureFrame = (delay: number) => {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }, delay)
      })
    }

    const takeMultiple = async () => {
      for (let i = 0; i < maxPhotos; i++) {
        const photo = await captureFrame(i * 1500)
        newPhotos.push(photo)
        setPhotos(prev => [...prev, photo])
      }

      setCapturing(false)
      onCapture(newPhotos)
    }

    takeMultiple()
  }, [maxPhotos, onCapture])

  const ringColor = {
    red: 'border-red-500 shadow-red-500/50',
    amber: 'border-amber-500 shadow-amber-500/50',
    green: 'border-emerald-500 shadow-emerald-500/50'
  }

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative overflow-hidden rounded-2xl border-4 ${ringColor[ring]} shadow-lg transition-colors duration-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-[3/4] w-full max-w-md object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        <AnimatePresence>
          {capturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="h-16 w-16 rounded-full border-4 border-white"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
          ring === 'red' ? 'bg-red-500/20 text-red-400' :
          ring === 'amber' ? 'bg-amber-500/20 text-amber-400' :
          'bg-emerald-500/20 text-emerald-400'
        }`}>
          <span className={`h-2 w-2 rounded-full ${
            ring === 'red' ? 'bg-red-500' :
            ring === 'amber' ? 'bg-amber-500' :
            'bg-emerald-500'
          }`} />
          {ringMessage}
        </div>

        <button
          onClick={capturePhoto}
          disabled={capturing}
          className="mt-2 rounded-full bg-[#C9A84C] px-8 py-3 text-sm font-medium text-[#0A0A0B] transition-all hover:bg-[#F0DFA0] disabled:opacity-50"
        >
          {capturing ? `Capturing ${photos.length + 1}/${maxPhotos}...` : 'Capture'}
        </button>
      </div>
    </div>
  )
}
