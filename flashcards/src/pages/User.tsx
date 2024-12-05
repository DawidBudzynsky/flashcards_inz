import { useState, useEffect } from 'react';
import { User, FlashcardSet } from '../types/interfaces';

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/users', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);

            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.ID}>
                        <strong>{user.Username}</strong> - {user.Email}
                        <ul>
                            {user.FlashcardsSets.map((flashcardSet: FlashcardSet) => (
                                <li key={flashcardSet.ID}>
                                    <a>{flashcardSet.Title}</a>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Users;
