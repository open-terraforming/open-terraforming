import React from 'react'
import { en } from '@/i18n/en'

export type LocaleValue = typeof en
export type LocaleLanguage = 'en'

export const LocaleContext = React.createContext(en)

type Props = {
	children: React.ReactNode
	language: LocaleLanguage
}

const languages = {
	en
}

export const LocaleContextProvider = ({ language, children }: Props) => {
	return (
		<LocaleContext.Provider value={languages[language]}>
			{children}
		</LocaleContext.Provider>
	)
}

export const useLocale = () => React.useContext(LocaleContext)
