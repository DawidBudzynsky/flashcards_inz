import "./App.css";
import { Routes, Route } from "react-router-dom";
import Users from "./pages/User";
import UserDetail from "./pages/UserDetail";
import FlashCardSetForm from "./pages/FlashCardSetForm";
import Layout from "./layout";
import FolderView from "./pages/FolderView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FlashcardSetView from "./pages/FlashcardSetView";
import FlashcardSetLearn from "./pages/FlashcardSetLearn";
import Home from "./pages/Home";
import TestQuestions from "./pages/TestQuestions";
import SharedTestHandler from "./pages/SharedTestHandler";

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
						<Route
							path="flashcards_sets/:setId/edit"
							element={<FlashCardSetForm />}
						/>
						<Route
							path="flashcards_sets/:setId/learn"
							element={<FlashcardSetLearn />}
						/>

						<Route
							path="/folders/:folderId"
							element={<FolderView />}
						/>
						<Route
							path="/flashcards_sets/:setId"
							element={<FlashcardSetView />}
						/>

						<Route
							path="/tests/:testId/questions"
							element={<TestQuestions />}
						/>

						<Route path="/user/tests" element={<TestQuestions />} />

						<Route
							path="/tests/testToken"
							element={<SharedTestHandler />}
						/>
					</Route>
				</Routes>
			</QueryClientProvider>
		</>
	);
}

export default App;
