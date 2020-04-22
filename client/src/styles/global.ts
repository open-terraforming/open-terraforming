import { createGlobalStyle } from 'styled-components'
import reset from './reset'
import mainColors from './mainColors'
import { rgba, darken } from 'polished'
import { colors } from '.'

export const GlobalStyle = createGlobalStyle`
${reset} 

* {
	padding: 0;
	margin: 0;
}

html, body, #application {
	width: 100%;
	height: 100%;
}

body {
	font-family: Oswald, Arial, Helvetica, sans-serif;
	color: ${mainColors.text};
}

body,html {
	overflow: hidden;
}


div::-webkit-scrollbar {
	width: 1rem;
	height: 1rem;
}

div::-webkit-scrollbar-track {
	background-color: ${colors.background};
}

div::-webkit-scrollbar-thumb {
	background-color: ${colors.border};
}


input[type=text],
input[type=number],
input[type=password],
textarea,
select {
	border: 1px solid ${rgba(mainColors.application, 0.8)};
	background-color: ${rgba(darken(0.2, mainColors.application), 0.5)};
	padding: 0.25rem 0.5rem;
	transition: border-color, background-color, box-shadow 0.2s ease;
	color: #eee;
}

input[type=checkbox] {
	display: inline-block;
}

select option {
	color: #eee;
	background: #000;
}

button, a {
	cursor: pointer;
}

.mr-2 {
	margin-right: 0.5rem;
}

/*
#app-modals {
	> div:not(:first-child) {
		background-color: transparent !important;
	}
}
*/

.fade-enter {
	opacity: 0;
	transition: opacity 100ms;
}
.fade-enter-active {
	opacity: 1;
	transition: opacity 100ms;
}
.fade-exit {
	transition: opacity 100ms;
	opacity: 1;
}
.fade-exit-active {
	opacity: 0;
	transition: opacity 100ms;
}

`
