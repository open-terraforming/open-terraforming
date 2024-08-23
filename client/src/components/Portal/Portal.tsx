import { PureComponent, ReactNode } from 'react'
import ReactDOM from 'react-dom'

type Props = { children: ReactNode }

// TODO: Rewrite to functional component
export class Portal extends PureComponent<Props> {
	el: HTMLDivElement

	constructor(props: Props) {
		super(props)

		this.el = document.createElement('div')
	}

	componentDidMount() {
		document.body.appendChild(this.el)
	}

	componentWillUnmount() {
		document.body.removeChild(this.el)
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.el)
	}
}
