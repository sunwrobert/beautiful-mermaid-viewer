import type { ColorMode } from './model'

export const STORAGE_KEY_LEFT_PANEL_WIDTH = 'mermaid-viewer:leftPanelWidth'
export const STORAGE_KEY_COLOR_MODE = 'mermaid-viewer:colorMode'

export const readLeftPanelWidth = (fallback: number): number => {
  const stored = localStorage.getItem(STORAGE_KEY_LEFT_PANEL_WIDTH)
  if (stored === null) {
    return fallback
  }
  const parsed = Number(stored)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const readColorMode = (): ColorMode => {
  const stored = localStorage.getItem(STORAGE_KEY_COLOR_MODE)
  if (stored === 'Dark') {
    return 'Dark'
  }
  if (stored === 'Light') {
    return 'Light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'Dark'
    : 'Light'
}
