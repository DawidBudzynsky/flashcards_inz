import './App.css'
import { Routes, Route } from 'react-router-dom'
import Users from './pages/User'
import UserDetail from './pages/UserDetail'
import FlashCardSetForm from './pages/FlashCardSetForm'
import Layout from './layout'
import FolderView from './pages/FolderView'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FlashcardSetView from './pages/FlashcardSetView'
import FlashcardSetLearn from './pages/FlashcardSetLearn'

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:userId" element={<UserDetail />} />
                        <Route path="/create" element={<FlashCardSetForm />} />
                        <Route path="flashcards_sets/:setId/edit" element={<FlashCardSetForm />} />
                        <Route path="flashcards_sets/:setId/learn" element={<FlashcardSetLearn />} />

                        <Route path="/folders/:folderId" element={<FolderView />} />
                        <Route path="/flashcards_sets/:setId" element={<FlashcardSetView />} />

                    </Route>
                </Routes>
            </QueryClientProvider>
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
