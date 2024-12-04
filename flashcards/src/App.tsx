import { useState, createContext, useEffect, useContext } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Users from './pages/User'
import UserDetail from './pages/UserDetail'
import FlashCardSetForm from './pages/FlashCardSetForm'
import FlowbiteNavbar from './components/navbar'


function App() {
    return (
        <>
            <FlowbiteNavbar handleLogin={handleLogin} />
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


const handleCheck = () => {
    window.location.href = "http://localhost:8080/check-user-logged-in"
};

function Home() {
    return (
        <>
            <h1>Home</h1>
            <button onClick={handleLogin}>login with google</button>
            <button onClick={handleCheck}>check</button>
        </>
    )

}


export default App
