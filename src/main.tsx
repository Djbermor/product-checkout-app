import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@ui/App'
import '@styles/index.css'
import { Provider } from 'react-redux'
import { store } from '@store/index'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
if (import.meta.hot) {
  import.meta.hot.accept()
}