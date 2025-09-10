import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract duration from an audio blob using the browser's Audio API
 * @param blob - The audio blob to analyze
 * @returns Promise that resolves to duration in seconds, or null if extraction fails
 */
export async function extractAudioDuration(blob: Blob): Promise<number | null> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio()
      const objectUrl = URL.createObjectURL(blob)
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(objectUrl)
        resolve(audio.duration)
      })
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl)
        resolve(null)
      })
      
      // Set a timeout to avoid hanging indefinitely
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        resolve(null)
      }, 5000) // 5 second timeout
      
      audio.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout)
      })
      
      audio.src = objectUrl
    } catch (error) {
      console.error('Error extracting audio duration:', error)
      resolve(null)
    }
  })
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 * @param duration - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(duration: number): string {
  if (isNaN(duration) || duration < 0) {
    return "0:00"
  }
  
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}