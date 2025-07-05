'use client'

import { useEffect } from 'react'

export function useKeyboardScroll() {
  useEffect(() => {
    let initialViewportHeight = window.innerHeight

    const handleResize = () => {
      const isKeyboardOpen = window.innerHeight < initialViewportHeight * 0.6;
      console.log('=========================useKeyboardScroll: ', window.innerHeight, initialViewportHeight, isKeyboardOpen);
      if (isKeyboardOpen) {
        console.log('.........................useKeyboardScroll isKeyboardOpen: ', window.innerHeight, initialViewportHeight, isKeyboardOpen);
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.matches('input, textarea, [contenteditable="true"]')) {
          setTimeout(() => {
            activeElement.scrollIntoView({ block: 'center' })
          }, 100)
        }
      }

      if (window.innerHeight > initialViewportHeight) {
        console.log('.........................useKeyboardScroll isKeyboardClose: ', window.innerHeight, initialViewportHeight, isKeyboardOpen);
        initialViewportHeight = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}
