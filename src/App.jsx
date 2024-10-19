import React from 'react'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import List from './components/List';
import Edit from './components/Edit';

const App = () => {
  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/list' element={<List/>}/>
        <Route path='/update' element={<Edit/>}/>
      </Routes>     
    </>
  )
}

export default App