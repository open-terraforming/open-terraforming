import { createGlobalStyle } from 'styled-components'
import input from './components/input'
import reset from './components/reset'
import scrollbar from './components/scrollbar'
import { media } from './media'
import transitions from './components/transitions'
import fonts from './components/fonts'

export const GlobalStyle = createGlobalStyle`
${fonts}
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
	color: ${({ theme }) => theme.colors.text};
}

body,html {
	overflow: hidden;
}

${media.medium} {
  html, body, button {
    font-size: 85%;
  }
}

${scrollbar}
${input}
${transitions}

button, a {
	cursor: pointer;
}

a {
	color: ${({ theme }) => theme.colors.text};
	text-decoration: none;
}

.mr-2 {
	margin-right: 0.5rem;
}
`
