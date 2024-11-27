import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Users from './pages/User'
import UserDetail from './pages/UserDetail'
import FlashCardSetForm from './pages/FlashCardSetForm'

function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/create" element={<FlashCardSetForm />} />
            </Routes>
        </>
    )
}


const handleLogin = () => {
    window.location.href = "http://localhost:8080/auth?provider=google"
};

function Home() {
    return (
        <>
            <h1>Home</h1>
            <button onClick={handleLogin}>login with google</button>
        </>
    )

}


export default App
