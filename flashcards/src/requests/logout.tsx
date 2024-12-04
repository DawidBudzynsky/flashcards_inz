async function handleLogout() {
    try {
        const response = await fetch('http://localhost:8080/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            console.log('User logged out successfully:', data.message);
            window.location.href = '/';
        } else {
            console.log('User not logged out');
        }
    } catch (error) {
        console.error('Error checking if user is logged in:', error);
    }
}

export default handleLogout;
