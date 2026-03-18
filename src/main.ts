import { Effect, Match as M, Option, Schema as S } from 'effect'
import { Runtime } from 'foldkit'
import { Command } from 'foldkit/command'
import { Html, html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { load, pushUrl } from 'foldkit/navigation'
import { evo } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import { uiInit } from './init'
import {
  ClickedCopyLink,
  ClickedZoomIn,
  ClickedZoomOut,
  ClickedZoomReset,
  DraggedSplitter,
  PressedSplitter,
  ReleasedSplitter,
  ToggledColorMode,
  UpdatedMermaidSource,
  UiMessage,
} from './message'
import { UiModel } from './model'
import { uiUpdate } from './update'

// MODEL

const Model = S.Struct({
  uiModel: UiModel,
})

type Model = typeof Model.Type

// MESSAGE

const CompletedInternalNavigation = m('CompletedInternalNavigation')
const CompletedExternalNavigation = m('CompletedExternalNavigation')
const ClickedLink = m('ClickedLink', {
  request: Runtime.UrlRequest,
})
const ChangedUrl = m('ChangedUrl', { url: Url })
const GotUiMessage = m('GotUiMessage', {
  message: UiMessage,
})

export const Message = S.Union(
  CompletedInternalNavigation,
  CompletedExternalNavigation,
  ClickedLink,
  ChangedUrl,
  GotUiMessage,
)
export type Message = typeof Message.Type

// INIT

const init: Runtime.ApplicationInit<Model, Message> = (_url: Url) => {
  const [initialUiModel, uiCommands] = uiInit()

  return [
    { uiModel: initialUiModel },
    uiCommands.map(Effect.map(message => GotUiMessage({ message }))),
  ]
}

// UPDATE

const update = (
  model: Model,
  message: Message,
): [Model, ReadonlyArray<Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<[Model, ReadonlyArray<Command<Message>>]>(),
    M.tagsExhaustive({
      CompletedInternalNavigation: () => [model, []],
      CompletedExternalNavigation: () => [model, []],

      ClickedLink: ({ request }) =>
        M.value(request).pipe(
          M.tagsExhaustive({
            Internal: ({
              url,
            }): [
              Model,
              ReadonlyArray<Command<typeof CompletedInternalNavigation>>,
            ] => [
              model,
              [
                pushUrl(urlToString(url)).pipe(
                  Effect.as(CompletedInternalNavigation()),
                ),
              ],
            ],
            External: ({
              href,
            }): [
              Model,
              ReadonlyArray<Command<typeof CompletedExternalNavigation>>,
            ] => [
              model,
              [load(href).pipe(Effect.as(CompletedExternalNavigation()))],
            ],
          }),
        ),

      ChangedUrl: () => [model, []],

      GotUiMessage: ({ message }) => {
        const [nextUiModel, uiCommands] = uiUpdate(model.uiModel, message)

        return [
          evo(model, { uiModel: () => nextUiModel }),
          uiCommands.map(Effect.map(message => GotUiMessage({ message }))),
        ]
      },
    }),
  )

// VIEW

const {
  a,
  button,
  div,
  empty,
  h1,
  span,
  textarea,
  Class,
  Href,
  InnerHTML,
  OnClick,
  OnInput,
  OnPointerDown,
  OnPointerMove,
  OnPointerUp,
  Placeholder,
  Style,
  Value,
} = html<Message>()

const toUiMessage = (message: typeof UiMessage.Type): Message =>
  GotUiMessage({ message })

const ZOOM_PERCENTAGE_MULTIPLIER = 100

const dragOverlayView = (model: Model): Html =>
  Option.isSome(model.uiModel.maybeSplitterDrag)
    ? div(
        [
          Class('fixed inset-0 z-50 cursor-col-resize'),
          OnPointerMove((screenX, _screenY, _pointerType) =>
            Option.some(toUiMessage(DraggedSplitter({ screenX }))),
          ),
          OnPointerUp((_screenX, _screenY, _pointerType, _timeStamp) =>
            Option.some(toUiMessage(ReleasedSplitter())),
          ),
        ],
        [],
      )
    : empty

const editorPanelView = (model: Model): Html =>
  div(
    [
      Class('flex flex-col min-w-0 shrink-0'),
      Style({ width: `${model.uiModel.leftPanelWidth}px` }),
    ],
    [
      textarea(
        [
          Class(
            'flex-1 w-full resize-none p-4 font-mono text-sm focus:outline-none bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100',
          ),
          Value(model.uiModel.mermaidSource),
          Placeholder('Paste mermaid diagram here...'),
          OnInput(value => toUiMessage(UpdatedMermaidSource({ value }))),
        ],
        [],
      ),
    ],
  )

const splitterView = (): Html =>
  div(
    [
      Class(
        'w-1.5 shrink-0 cursor-col-resize transition-colors bg-gray-200 hover:bg-accent-400 dark:bg-gray-700 dark:hover:bg-accent-400',
      ),
      OnPointerDown(
        (_pointerType, _button, screenX, _screenY, _timeStamp) =>
          Option.some(toUiMessage(PressedSplitter({ screenX }))),
      ),
    ],
    [],
  )

const zoomControlsView = (model: Model): Html =>
  div(
    [Class('flex items-center gap-1')],
    [
      button(
        [
          Class(
            'px-2 py-0.5 text-sm rounded cursor-pointer text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
          ),
          OnClick(toUiMessage(ClickedZoomOut())),
        ],
        ['\u2212'],
      ),
      span(
        [
          Class(
            'text-xs w-10 text-center tabular-nums text-gray-500 dark:text-gray-400',
          ),
        ],
        [
          `${String(Math.round(model.uiModel.zoomLevel * ZOOM_PERCENTAGE_MULTIPLIER))}%`,
        ],
      ),
      button(
        [
          Class(
            'px-2 py-0.5 text-sm rounded cursor-pointer text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
          ),
          OnClick(toUiMessage(ClickedZoomIn())),
        ],
        ['+'],
      ),
      button(
        [
          Class(
            'px-2 py-0.5 text-xs rounded cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
          ),
          OnClick(toUiMessage(ClickedZoomReset())),
        ],
        ['Reset'],
      ),
    ],
  )

const copyLinkLabel = (model: Model): string => {
  switch (model.uiModel.copyStatus) {
    case 'Copied':
      return 'Copied!'
    case 'Failed':
      return 'Failed'
    default:
      return 'Copy Link'
  }
}

const copyLinkView = (model: Model): Html =>
  button(
    [
      Class(
        'px-3 py-1 text-xs font-medium rounded cursor-pointer border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
      ),
      OnClick(toUiMessage(ClickedCopyLink())),
    ],
    [copyLinkLabel(model)],
  )

const colorModeToggleView = (model: Model): Html =>
  button(
    [
      Class(
        'px-2 py-1 text-sm rounded cursor-pointer text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
      ),
      OnClick(toUiMessage(ToggledColorMode())),
    ],
    [model.uiModel.colorMode === 'Light' ? '\u263E' : '\u2600'],
  )

const previewPanelView = (model: Model): Html =>
  div(
    [Class('flex-1 flex flex-col min-w-0')],
    [
      div(
        [
          Class(
            'flex items-center justify-between px-4 py-2 border-b bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700',
          ),
        ],
        [
          span(
            [
              Class(
                'text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400',
              ),
            ],
            ['Preview'],
          ),
          zoomControlsView(model),
        ],
      ),
      div(
        [Class('flex-1 overflow-auto bg-white dark:bg-gray-900')],
        [
          div(
            [
              Class('p-4 inline-block'),
              Style({ zoom: String(model.uiModel.zoomLevel) }),
              InnerHTML(model.uiModel.renderedSvg),
            ],
            [],
          ),
        ],
      ),
    ],
  )

const view = (model: Model): Html =>
  div(
    [
      Class(
        model.uiModel.colorMode === 'Dark'
          ? 'dark flex flex-col h-screen bg-gray-950'
          : 'flex flex-col h-screen bg-gray-50',
      ),
    ],
    [
      div(
        [
          Class(
            'flex items-center justify-between px-6 py-3 border-b bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700',
          ),
        ],
        [
          div(
            [Class('flex items-center gap-3')],
            [
              h1(
                [
                  Class(
                    'text-lg font-semibold text-gray-900 dark:text-gray-100',
                  ),
                ],
                ['Mermaid Viewer'],
              ),
              a(
                [
                  Href('https://agents.craft.do/mermaid'),
                  Class(
                    'text-xs text-gray-400 hover:text-accent-500 dark:text-gray-500 dark:hover:text-accent-400',
                  ),
                ],
                ['Powered by beautiful-mermaid'],
              ),
            ],
          ),
          div(
            [Class('flex items-center gap-2')],
            [copyLinkView(model), colorModeToggleView(model)],
          ),
        ],
      ),
      div(
        [Class('flex flex-1 min-h-0')],
        [
          dragOverlayView(model),
          editorPanelView(model),
          splitterView(),
          previewPanelView(model),
        ],
      ),
    ],
  )

// RUN

const app = Runtime.makeApplication({
  Model,
  init,
  update,
  view,
  container: document.getElementById('root')!,
  browser: {
    onUrlRequest: request => ClickedLink({ request }),
    onUrlChange: url => ChangedUrl({ url }),
  },
})

Runtime.run(app)
