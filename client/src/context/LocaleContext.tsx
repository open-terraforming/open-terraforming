import { en } from '@/i18n/en'
import { createContext, ReactNode, useContext } from 'react'

export type LocaleValue = typeof en
export type LocaleLanguage = 'en'

export const LocaleContext = createContext(en)

type Props = {
	children: ReactNode
	language: LocaleLanguage
}

const languages = {
	en,
}

export const LocaleContextProvider = ({ language, children }: Props) => {
	return (
		<LocaleContext.Provider value={languages[language]}>
			{children}
		</LocaleContext.Provider>
	)
}

export const useLocale = () => useContext(LocaleContext)
