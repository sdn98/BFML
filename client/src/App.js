import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/header/header'
import Home from './pages/home/home'
import Train from './pages/train/train'
import { Navigate } from 'react-router-dom'
import './App.css'
import Utilities from './pages/utils/utilities'

// JSX template for the different routes
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/train/:id' element={<Train />} />
        <Route path='/utilities' element={<Utilities />} />
        <Route path='/' element={<Navigate to='/home' />} />
      </Routes>
    </Router>
  )
}
