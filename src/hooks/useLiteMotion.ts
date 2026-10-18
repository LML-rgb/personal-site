import { useSyncExternalStore } from 'react'

// Include landscape phones/tablets as well as narrow browser windows. Read the
// initial match synchronously so mobile never mounts a WebGL renderer first.
const preference = window.matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)')
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

function subscribe(listener: () => void) {
  if (!listeners.size) preference.addEventListener('change', notify)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) preference.removeEventListener('change', notify)
  }
}

export const isLiteMotion = () => preference.matches

export default function useLiteMotion() {
  return useSyncExternalStore(subscribe, isLiteMotion, () => true)
}
