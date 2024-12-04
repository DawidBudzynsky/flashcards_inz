async function checkIfLoggedIn() {
    try {
        const response = await fetch('http://localhost:8080/check-user-logged-in', {
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
            console.log('User is logged in:', data.message);

            // Optionally store data in sessionStorage if needed
            // sessionStorage.setItem('isLoggedIn', "true");

            return true; // User is logged in

        } else {
            console.log('User is not logged in');

            return false; // User is not logged in
        }
    } catch (error) {
        console.error('Error checking if user is logged in:', error);
        return false; // Assume not logged in on error
    }
}

export default checkIfLoggedIn;
