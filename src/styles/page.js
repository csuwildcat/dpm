import { css } from 'lit'

export default css`

[hide-on-overlay] {
  transition: opacity 0.3s ease;
} 

:host-context(html[overlay-active]) [hide-on-overlay] {
  opacity: 0;
  pointer-events: none;
} 

:host([route-state="active"]) {
  z-index: 1;
}

:host([route-state="active"]) > section {
  opacity: 1;
}

:host([page]) > * {
  margin: 0 auto;
}

:host([page]) > section {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--content-max-width);
  padding: 2.75rem 2.25rem;
}

:host([page]) > section > :first-child {
  margin-top: 0;
}

h2,h3,h4,h5,h6 {
  font-family: var(--app-font);
  font-weight: normal;
}

ul, ol {
  margin: 0;
  padding: 0;
}

.markdown-body *:is(ul, ol) {
  padding: 0.25em 1.2em;
}

form input,
form textarea,
form sl-input::part(input),
form sl-textarea::part(textarea) {
  transition: color 0.5s ease;
}

form[loading] input,
form[loading] textarea,
form[loading] sl-input::part(input),
form[loading] sl-textarea::part(textarea) {
  color: transparent;
}

::part(form-control-help-text) {
  font-size: 0.75em;
}

/* sl-input, sl-textarea, vaadin-combo-box {
  margin: 0 0 1em;
} */

sl-icon::part(svg) {
  width: 1em;
  height: 1em;
}

sl-button::part(base) {
  align-items: center;
}

sl-button:not([circle]) sl-icon { 
  font-size: 1rem;
  padding: 0.4rem 0;
}

sl-dialog::part(panel) {
  width: calc(100% - 2rem);
  max-width: 600px;
}

sl-dialog[fit-content]::part(panel) {
  height: fit-content;
  width: fit-content;
  max-width: calc(100% - 2rem);
}

sl-dialog::part(header) {
  border-bottom: 1px solid rgb(255 255 255 / 2%);
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.15);
}

sl-dialog::part(header-actions) {
  padding: 0 1rem;
}

sl-dialog::part(title) {
  padding: 1rem 1.2rem;
}

sl-dialog[tabbed]:has(sl-tab-group)::part(body) {
  padding: 0;
}

sl-dialog[tabbed] sl-tab-panel::part(base) {
  padding: 1rem 1rem 1.5rem;
}

sl-dialog::part(footer) {
  border-top: 1px solid rgba(255 255 255 / 5%);
  box-shadow: 0 -1px 1px 0px rgba(0 0 0 / 15%);
}

sl-tab-group::part(tabs) {
  border-bottom: 1px solid var(--track-color);
}

*::part(input-field) {
  background: var(--sl-input-background-color);
  border: solid var(--sl-input-border-width) var(--sl-input-border-color);
}

*::part(form-control-label) {
  margin: 0 0 0.4em;
  font-size: var(--sl-input-label-font-size-medium)
}

[pressable] * {
  pointer-events: none;
}

[flex] {
  display: flex;
}

[flex~="inline"] {
  display: inline-flex;
}

[flex~="column"] {
  flex-direction: column;
}

[flex~="end"] {
  align-items: end;
}

[flex~="column"][flex~="end"],
[flex~="column-reverse"][flex~="end"] {
  justify-content: flex-end;
}

[flex~="column-reverse"] {
  flex-direction: column-reverse;
}

[flex~="wrap"] {
  flex-wrap: wrap;
}

[flex~="shrink"] {
  flex: 0;
}

[flex~="fill"] {
  flex: 1;
}

[flex~="align-start"], [flex~="start"] {
  align-items: start;
}

[flex~="end"] {
  align-items: end;
}

[flex~="center-x"]:not([flex~="column"]) {
  justify-content: center;
}

[flex~="center-x"][flex~="column"] {
  align-items: center;
}

[flex~="center-y"]:not([flex~="column"]) {
  align-items: center;
}

[flex~="center-y"][flex~="column"] {
  justify-content: center;
}

[flex~="gap-small"] > * {
  margin: 0 0.5em 0.5em 0;
}

[flex~="gap-medium"] > * {
  margin: 0 1em 1em 0;
}

[flex~="gap-large"] > * {
  margin: 0 2em 2em 0;
}

[default-content] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

[default-content~="cover"] {
  position: absolute;
  inset: 0;
  z-index: 1000;
}

[default-content~="placeholder"] > :is(svg, sl-icon) {
  display: block;
  margin: 1rem auto 1.75rem;
  font-size: 9em;
  max-width: 300px;
  height: auto;
  color: var(--header-bk);
  transition: opacity 0.3s ease, visibility 0.3s;
}

[default-content~="firstrun"] > :is(svg, sl-icon) {
  display: block;
  margin: 4rem auto;
  font-size: 50vh;
  width: 100%;
  max-width: 800px;
  height: auto;
  color: var(--header-bk);
}

[default-content~="clickable"] {
  cursor: pointer;
}

[default-content~="clickable"] {
  transition: background-color 0.25s ease;
}

[default-content~="clickable"]:hover {
  background-color: rgba(255 255 255 / 0.075)
}

.text-logo {
  font-family: var(--app-font);
}

[divider] {
  display: flex;
  margin: 2rem 0;
  align-items: center;
  text-align: center;
  white-space: nowrap;
}

[divider]::before,
[divider]::after {
  content: '';
  flex-grow: 1;
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

[divider]::before {
  margin: 3px 0.5rem 0 0; /* Space between the line and the word */
}

[divider]::after {
  margin: 3px 0 0 0.5rem; /* Space between the word and the line */
}

[divider]:empty::before,
[divider]:empty::after {
  margin: 3px 0 0 0;
}

[break-text] {
  display: block;
  position: relative;
  width: 100%;
  margin: 1.5em 0;
  box-sizing: border-box;
  text-align: center;
}

[break-text]::before {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 0px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

[break-text]::after {
  content: attr(break-text);
  position: relative;
  top: -0.15em;
  padding: 0 0.5em;
  background: inherit;
}

[empty-text]:empty::before, [empty-text][empty]::before {
  content: attr(empty-text);
  display: block;
  width: 100%;
  font-size: 85%;
  color: rgba(255,255,255,0.5);
  font-style: italic;
}

[columns~="2"] {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;  /* Adjusts spacing between rows and columns */
  align-items: center;
}

[columns~="2"] > *:nth-child(2n + 1) {
  font-family: var(--app-font);
}

[columns~="2"][columns~="labels-right"] > *:nth-child(2n + 1) {
  text-align: right;
}

[ellipsis] {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shadow-icon {
  filter: drop-shadow(0px 1px 1px rgba(0 0 0 / 50%));
}

/* sl-icon-button:hover:not(.icon-button--disabled)::part(base), .icon-button:focus-visible:not(.icon-button--disabled)::part(base) {
  color: currentColor;
  filter: drop-shadow(0px 1px 2px rgba(0 0 0 / 35%));
} */


.page-dialog::part(panel) {
  max-height: calc(100% - var(--header-height) - var(--sl-spacing-2x-large));
  margin-top: var(--header-height);
}

.hero[src] {
  background: none;
}

.hero::part(fallback) {
  display: none;
}

.hero sl-icon-button {
  position: absolute;
  top: 1em;
  right: 1em;
  background: rgba(0 0 0 / 0.6);
  border-radius: 100%;
  cursor: pointer;
  z-index: 3;
} 

#view_header {
  position: sticky;
  top: 0;
  max-width: none;
  padding: 1.1em 1.2em 1em;
  background: rgba(44 44 49 / 90%);
  border-bottom: 1px solid rgba(0 0 0 / 50%);
  z-index: 1;
}

@media(max-width: 500px) {

  :host([page]) > section {
    padding: 1.5rem 1.25rem;
  }

  :host([page~="full-width"]) > section {
    padding: 0;
  }

  .page-dialog::part(panel) {
    width: 100%;
    height: calc(100% - var(--header-height));
    max-width: none;
    max-height: none;
    margin-top: var(--header-height);
    box-shadow: none;
    border-radius: 0;
  }
}

`