import { renderMermaidSVG, THEMES } from 'beautiful-mermaid'

import type { ColorMode } from './model'

export const renderDiagram = (
  source: string,
  colorMode: ColorMode,
): string => {
  try {
    const theme = colorMode === 'Dark' ? THEMES['tokyo-night'] : undefined
    return renderMermaidSVG(source, theme)
  } catch {
    return ''
  }
}
