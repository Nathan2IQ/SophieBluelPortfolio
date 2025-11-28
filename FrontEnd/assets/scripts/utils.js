const apiUrl = "http://localhost:5678/api/";

export async function getData(route) {
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

export async function postData(route, body, auth = false, isFormData = false) {
  try {
    const options = {
      method: "POST",
      headers: {},
    };

    if (auth) {
      const token = localStorage.getItem("token");
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    // Si body est un FormData, ne pas mettre Content-Type
    if (isFormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(apiUrl + route, options);
    if (!response.ok) {
      throw new Error("Network post response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Post error:", error);
  }
}

export async function deleteData(route) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(apiUrl + route, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return true;
    } else {
      throw new Error("Network delete response was not ok");
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
}
