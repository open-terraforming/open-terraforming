import { createGlobalStyle } from 'styled-components'
import reset from './reset'

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
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	color: #333;
}

input[type=text],
input[type=number],
input[type=password],
textarea,
select {
	border: 1px solid #eee;
	padding: 0.25rem 0.5rem;
	transition: border-color, background-color, box-shadow 0.2s ease;
	color: #eee;
}

select option {
	color: #000;
}

button, a {
	cursor: pointer;
}

`
