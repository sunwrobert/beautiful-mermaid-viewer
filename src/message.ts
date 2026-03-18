import { Schema as S } from 'effect'
import { m } from 'foldkit/message'

export const UpdatedMermaidSource = m('UpdatedMermaidSource', {
  value: S.String,
})
export const PressedSplitter = m('PressedSplitter', {
  screenX: S.Number,
})
export const DraggedSplitter = m('DraggedSplitter', {
  screenX: S.Number,
})
export const ReleasedSplitter = m('ReleasedSplitter')
export const ClickedZoomIn = m('ClickedZoomIn')
export const ClickedZoomOut = m('ClickedZoomOut')
export const ClickedZoomReset = m('ClickedZoomReset')
export const TriggeredMermaidRender = m('TriggeredMermaidRender', {
  generation: S.Number,
})
export const ToggledColorMode = m('ToggledColorMode')
export const CompletedSplitterPersist = m('CompletedSplitterPersist')
export const CompletedColorModePersist = m('CompletedColorModePersist')
export const ClickedCopyLink = m('ClickedCopyLink')
export const CompletedCopyLink = m('CompletedCopyLink', {
  success: S.Boolean,
})
export const ResetCopyStatus = m('ResetCopyStatus')

export const UiMessage = S.Union(
  UpdatedMermaidSource,
  PressedSplitter,
  DraggedSplitter,
  ReleasedSplitter,
  ClickedZoomIn,
  ClickedZoomOut,
  ClickedZoomReset,
  TriggeredMermaidRender,
  ToggledColorMode,
  CompletedSplitterPersist,
  CompletedColorModePersist,
  ClickedCopyLink,
  CompletedCopyLink,
  ResetCopyStatus,
)
export type UiMessage = typeof UiMessage.Type
