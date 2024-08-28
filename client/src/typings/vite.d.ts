/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_API_URL: string
	readonly VITE_CARD_IMAGES_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
