const apiUrl = "http://localhost:5678/api/";

export async function fetchJSON(route) {
  try {
    const response = await fetch(apiUrl + route);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
