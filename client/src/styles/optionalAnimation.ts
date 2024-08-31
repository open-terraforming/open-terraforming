import { DefaultTheme, RuleSet } from 'styled-components'

export const optionalAnimation =
	<Props extends { theme: DefaultTheme }, R extends RuleSet>(
		animated: ((props: Props) => R) | R,
		otherwise?: ((props: Props) => R) | R,
	) =>
	(props: Props) =>
		props.theme.animations.enabled
			? typeof animated === 'function'
				? animated(props)
				: animated
			: typeof otherwise === 'function'
				? otherwise(props)
				: otherwise
