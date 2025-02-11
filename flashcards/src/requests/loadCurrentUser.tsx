export const loadCurrentUser = async () => {
  const response = await fetch("http://localhost:8080/users/me", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};
