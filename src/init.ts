import { Option } from 'effect'
import { Command } from 'foldkit/command'

import type { UiMessage } from './message'
import type { UiModel } from './model'
import { renderDiagram } from './render'
import { readColorMode, readLeftPanelWidth } from './storage'

const DEFAULT_SOURCE = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`

export const uiInit = (): [UiModel, ReadonlyArray<Command<UiMessage>>] => {
  const colorMode = readColorMode()
  const initialSvg = renderDiagram(DEFAULT_SOURCE, colorMode)
  const defaultWidth = Math.round(window.innerWidth / 2)

  return [
    {
      mermaidSource: DEFAULT_SOURCE,
      renderedSvg: initialSvg,
      renderGeneration: 0,
      leftPanelWidth: readLeftPanelWidth(defaultWidth),
      maybeSplitterDrag: Option.none(),
      zoomLevel: 1,
      colorMode,
    },
    [],
  ]
}
