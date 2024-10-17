async function fetchBookDetails(bookId) {
  try {
    const response = await fetch(`https://gutendex.com/books/${bookId}`);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      // Handle different types of errors (e.g., 404, 500)
      if (response.status === 404) {
        throw new Error(`Book with ID ${bookId} not found.`);
      } else {
        throw new Error(`Error fetching book details: ${response.statusText}`);
      }
    }

    // Parse the JSON response
    const bookData = await response.json();
    displayBookDetails(bookData);
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    displayErrorMessage(error.message); // Custom function to display error to the user
  }
}

function displayBookDetails(bookData) {
  // Implement your logic to display book details on the page
  const bookDetailsElement = document.getElementById("book_details"); // Ensure you have an element with this ID
  bookDetailsElement.innerHTML = `
      <h2>${bookData.title}</h2>
      <p><strong>Author:</strong> ${bookData.authors
        .map((author) => author.name)
        .join(", ")}</p>
      <p><strong>Description:</strong> ${
        bookData.description || "No description available."
      }</p>
      <img src="${bookData.formats["image/jpeg"]}" alt="${
    bookData.title
  } cover image" />
    `;
}

function displayErrorMessage(message) {
  const errorElement = document.getElementById("error_message"); // Ensure you have an element with this ID
  if (errorElement) {
    errorElement.textContent = message; // Display error message in the UI
  } else {
    console.error("Error element not found for displaying the message.");
  }
}

// Call fetchBookDetails on page load or based on the ID from the URL
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id"); // Assuming the URL has a query parameter like ?id=2701

  if (bookId) {
    fetchBookDetails(bookId);
  } else {
    displayErrorMessage("Book ID is missing in the URL.");
  }
});
