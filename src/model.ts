import { Schema as S } from 'effect'

const SplitterDrag = S.Struct({
  startScreenX: S.Number,
  startLeftWidth: S.Number,
})

export const ColorMode = S.Literal('Light', 'Dark')
export type ColorMode = typeof ColorMode.Type

export const UiModel = S.Struct({
  mermaidSource: S.String,
  renderedSvg: S.String,
  renderGeneration: S.Number,
  leftPanelWidth: S.Number,
  maybeSplitterDrag: S.OptionFromSelf(SplitterDrag),
  zoomLevel: S.Number,
  colorMode: ColorMode,
})
export type UiModel = typeof UiModel.Type
