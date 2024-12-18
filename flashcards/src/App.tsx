import './App.css'
import { Routes, Route } from 'react-router-dom'
import Users from './pages/User'
import UserDetail from './pages/UserDetail'
import FlashCardSetForm from './pages/FlashCardSetForm'
import Layout from './layout'
import FolderView from './pages/FolderView'


function App() {
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:userId" element={<UserDetail />} />
                    <Route path="/create" element={<FlashCardSetForm />} />
                    <Route path="/create" element={<FlashCardSetForm />} />
                    <Route path="/folders/:folderId" element={<FolderView />} />
                </Route>
            </Routes>
        </>
    )
}



const handleCheck = () => {
    window.location.href = "http://localhost:8080/check-user-logged-in"
};

function Home() {
    return (
        <>
            <h1>Home</h1>
            <button onClick={handleCheck}>check</button>
        </>
    )

}


export default App
