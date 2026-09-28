# Settings and command-palette search

The settings view and command palette each have an independent, device-local search state. Both default to plain-text matching against a hand-written index. The settings index covers appearance, language and tone, speech controls, local wording-file selection and status, and local clearing. The palette index includes its four page sections and the settings controls. Selecting an indexed result opens the relevant section, scrolls to the control, and moves keyboard focus. File selection and clearing are activated only when the matching result is selected.

Each search has its own optional JavaScript regular-expression builder. A pattern remains inactive until the user applies a valid expression. The builder has start, end, and word-boundary insertion, literal escaping, flags, bounded test text, sample match counts, indexed-result previews, replacement previews, and elapsed-time reporting. Invalid or unsafe patterns are refused and do not replace a valid pattern. Returning to plain text restores ordinary substring matching. Queries, pattern state, and the selected mode are stored in this browser only.

The visible labels, search status, no-result text, builder controls, and result names support English, Cantonese, and bilingual mode. Search result controls are buttons with native keyboard and touch activation, visible focus, and a 44-pixel minimum target. Escape closes an open builder and returns focus to its toggle.

## Failure modes and privacy

An empty or invalid expression, unsupported flag, duplicate flag, expression longer than 128 characters, or test sample longer than 512 characters is refused. Nested repeated groups and quantified alternatives are rejected by a bounded risk screen. The browser's regular-expression parser supplies details for syntax it rejects. This screen reduces known backtracking risks but does not prove every expression safe.

Search runs in the page and does not send queries, selected controls, or visitor preferences to a server. The indexed settings refer only to local controls. Uploaded wording files remain subject to the existing local validation and storage rules. Search does not load or reveal their contents.

## Verification

The current inline JavaScript parses. Source checks found no duplicate element IDs, labels without targets, literal element selectors without matching IDs, or missing localized keys. Five focused assertions against the page's actual regex helpers passed: anchored matching, invalid syntax refusal, ambiguous-repeat refusal, the 128-character limit, and duplicate-flag refusal. These checks do not exercise the rendered controls.

The isolated browser-control route required for current built-page interaction and capture was not available in this task environment. Runtime behavior, keyboard and touch interaction, accessibility-tree output, 320-pixel layout, and capture evidence therefore remain unverified for this implementation. Do not use earlier gallery captures as evidence for these new controls.
