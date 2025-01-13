import { deleteSetByID, getFlashcardSetByID } from '../requests/flashcardset';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUser } from "../requests/user";
import { User, FlashcardSet, Folder, Flashcard } from "../types/interfaces";
import FlashcardComponent from '../components/flashcard';
import ListItem from '../components/ListItem';

const Home: React.FC = () => {
    // Fetch user data using useQuery
    const { data: user, status: userStatus, error: userError } = useQuery<User>({
        queryKey: ["user"],
        queryFn: getUser,
    });

    return (

        <div className="grid  grid-cols-2 p-4 max-w-5xl w-5/6 mx-auto space-x-6">

            <div className='bg-gray-50 rounded-lg py-4'>
                <h1 className='text-3xl font-bold'>Currently tracked cards</h1>
                {user?.FlashcardsSets.flatMap((set: FlashcardSet) =>
                    set.Flashcards.filter((flashcard) => flashcard.Tracking)
                ).map((trackedFlashcard: Flashcard) => (
                    <div key={trackedFlashcard.ID}>
                        <FlashcardComponent flashcard={trackedFlashcard} />
                    </div>
                ))}
            </div>

            <div className='bg-gray-50 rounded-lg py-4 space-y-2.5'>
                <h1 className='text-3xl font-bold'>Review progress</h1>
                <div className="radial-progress" style={{ "--value": "70", "--size": "12rem", "--thickness": "1rem" }} role="progressbar">70%</div>

                <h1 className='text-2xl font-semibold'>Favourite Sets</h1>
                <div>
                    {user?.FlashcardsSets.slice(0, 3).map((set: FlashcardSet) => (
                        <ListItem set={set} />
                    ))}
                </div>
            </div>

        </div >
    )
}
export default Home
