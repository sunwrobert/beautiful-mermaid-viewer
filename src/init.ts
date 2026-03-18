import { Option } from 'effect'
import { Command } from 'foldkit/command'

import { decodeDiagram } from './codec'
import type { UiMessage } from './message'
import type { UiModel } from './model'
import { renderDiagram } from './render'
import { readColorMode, readLeftPanelWidth } from './storage'

const DEFAULT_SOURCE = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`

const readSourceFromHash = (): string | null => {
  const hash = window.location.hash.slice(1)
  if (!hash) return null
  return decodeDiagram(hash)
}

export const uiInit = (): [UiModel, ReadonlyArray<Command<UiMessage>>] => {
  const colorMode = readColorMode()
  const source = readSourceFromHash() ?? DEFAULT_SOURCE
  const initialSvg = renderDiagram(source, colorMode)
  const defaultWidth = Math.round(window.innerWidth / 2)

  return [
    {
      mermaidSource: source,
      renderedSvg: initialSvg,
      renderGeneration: 0,
      leftPanelWidth: readLeftPanelWidth(defaultWidth),
      maybeSplitterDrag: Option.none(),
      zoomLevel: 1,
      colorMode,
      copyStatus: 'Idle',
    },
    [],
  ]
}
