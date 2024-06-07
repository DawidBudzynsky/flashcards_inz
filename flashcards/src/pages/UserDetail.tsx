import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../types/interfaces';
import FlashcardSetComponent from '../components/flashcardSet';

const UserDetail: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
                setLoading(false);
            } catch (error) {
                setError((error as Error).message);
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {user ? (
                <div>
                    <h2>{user.Username}</h2>
                    <p>Email: {user.Email}</p>
                    <p>Role: {user.Role}</p>
                    <h3>Flashcard Sets</h3>
                    <ul>
                        {user.FlashcardsSets.map(flashcardSet => (
                            <li key={flashcardSet.ID}>
                                <FlashcardSetComponent flashcardSet={flashcardSet} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>User not found</div>
            )}
        </div>
    );
};

export default UserDetail;
