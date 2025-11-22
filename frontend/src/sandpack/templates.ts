import appSource from './App.jsx?raw'
import counterSource from './Counter.jsx?raw'
import storeSource from './store.js?raw'
import stylesSource from './styles.css?raw'

export const baseFiles = {
  '/App.jsx': appSource,
  '/Counter.jsx': counterSource,
  '/store.js': storeSource,
  '/styles.css': stylesSource,
}

export const sandpackDependencies = {
  react: '19.1.1',
  'react-dom': '19.1.1',
  zustand: '5.0.8',
  motion: '12.23.12',
  'lucide-react': '0.542.0',
}
