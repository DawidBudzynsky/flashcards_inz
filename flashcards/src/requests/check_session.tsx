async function checkIfLoggedIn() {
	try {
		const response = await fetch(
			"http://localhost:8080/check-user-logged-in",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		if (data.success) {
			// sessionStorage.setItem('isLoggedIn', "true");
			return true;
		} else {
			console.log("User is not logged in");

			return false;
		}
	} catch (error) {
		console.error("Error checking if user is logged in:", error);
		return false;
	}
}

export default checkIfLoggedIn;
