import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductPage from '@pages/ProductPage'
import CheckoutPage from '@pages/CheckoutPage'
import SummaryPage from '@pages/SummaryPage'
import StatusPage from '@pages/StatusPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
    </Router>
  )
}

export default App
import React from 'react'