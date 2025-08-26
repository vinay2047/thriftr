import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {
  

  return (
    <Routes>
      <Route path='/' element={<h1>Home</h1>}/>
      <Route path='/register' element={<h1>Register</h1>}/> 
      <Route path='/login' element={<h1>Login</h1>}/>
      
    </Routes>
  )
}

export default App
