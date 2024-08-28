/**
 * This is required for Theme to be strongly typed in styled-components.
 */

import * as theme from '@/styles'

type ThemeInterface = Readonly<typeof theme>

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
	interface DefaultTheme extends ThemeInterface {}
}
