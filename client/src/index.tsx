import { Root } from './Root'
import { createRoot } from 'react-dom/client'
import { localSessionsStore } from './utils/localSessionsStore'

// Ensure local data are up to date
localSessionsStore.load()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('application')!)
root.render(<Root />)
