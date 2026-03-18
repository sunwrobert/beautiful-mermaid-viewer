import { Effect, Match as M, Number, Option } from 'effect'
import { Command } from 'foldkit/command'
import { evo } from 'foldkit/struct'

import {
  CompletedColorModePersist,
  CompletedSplitterPersist,
  TriggeredMermaidRender,
  type UiMessage,
} from './message'
import type { ColorMode, UiModel } from './model'
import { renderDiagram } from './render'
import { STORAGE_KEY_COLOR_MODE, STORAGE_KEY_LEFT_PANEL_WIDTH } from './storage'

const RENDER_DEBOUNCE_MS = 300
const MIN_PANEL_WIDTH = 200
const MIN_ZOOM = 0.25
const MAX_ZOOM = 4
const ZOOM_FACTOR = 1.25

const toggleColorMode = (mode: ColorMode): ColorMode =>
  mode === 'Light' ? 'Dark' : 'Light'

export type UiUpdateReturn = [UiModel, ReadonlyArray<Command<UiMessage>>]
const withUpdateReturn = M.withReturnType<UiUpdateReturn>()

export const uiUpdate = (model: UiModel, message: UiMessage): UiUpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      UpdatedMermaidSource: ({ value }) => {
        const nextGeneration = model.renderGeneration + 1
        return [
          evo(model, {
            mermaidSource: () => value,
            renderGeneration: () => nextGeneration,
          }),
          [
            Effect.succeed(
              TriggeredMermaidRender({ generation: nextGeneration }),
            ).pipe(Effect.delay(RENDER_DEBOUNCE_MS)),
          ],
        ]
      },

      TriggeredMermaidRender: ({ generation }) => {
        if (generation !== model.renderGeneration) {
          return [model, []]
        }
        return [
          evo(model, {
            renderedSvg: () =>
              renderDiagram(model.mermaidSource, model.colorMode),
          }),
          [],
        ]
      },

      PressedSplitter: ({ screenX }) => [
        evo(model, {
          maybeSplitterDrag: () =>
            Option.some({
              startScreenX: screenX,
              startLeftWidth: model.leftPanelWidth,
            }),
        }),
        [],
      ],

      DraggedSplitter: ({ screenX }) =>
        Option.match(model.maybeSplitterDrag, {
          onNone: (): UiUpdateReturn => [model, []],
          onSome: ({ startScreenX, startLeftWidth }): UiUpdateReturn => {
            const delta = screenX - startScreenX
            const newWidth = Math.max(MIN_PANEL_WIDTH, startLeftWidth + delta)
            return [evo(model, { leftPanelWidth: () => newWidth }), []]
          },
        }),

      ReleasedSplitter: () => [
        evo(model, { maybeSplitterDrag: () => Option.none() }),
        [
          Effect.sync(() => {
            localStorage.setItem(
              STORAGE_KEY_LEFT_PANEL_WIDTH,
              String(model.leftPanelWidth),
            )
          }).pipe(Effect.as(CompletedSplitterPersist())),
        ],
      ],

      ToggledColorMode: () => {
        const nextMode = toggleColorMode(model.colorMode)
        return [
          evo(model, {
            colorMode: () => nextMode,
            renderedSvg: () => renderDiagram(model.mermaidSource, nextMode),
          }),
          [
            Effect.sync(() => {
              localStorage.setItem(STORAGE_KEY_COLOR_MODE, nextMode)
            }).pipe(Effect.as(CompletedColorModePersist())),
          ],
        ]
      },

      ClickedZoomIn: () => [
        evo(model, {
          zoomLevel: level => Math.min(MAX_ZOOM, level * ZOOM_FACTOR),
        }),
        [],
      ],

      ClickedZoomOut: () => [
        evo(model, {
          zoomLevel: level => Math.max(MIN_ZOOM, level / ZOOM_FACTOR),
        }),
        [],
      ],

      ClickedZoomReset: () => [evo(model, { zoomLevel: () => 1 }), []],

      CompletedSplitterPersist: () => [model, []],
      CompletedColorModePersist: () => [model, []],
    }),
  )
