const detailsElementSelect = {
  bookDetailsElement: document.getElementById("book_details"),
  breadcrumbProductTitle: document.getElementById("details_title"),
};
const { bookDetailsElement, breadcrumbProductTitle } = detailsElementSelect;
bookDetailsElement.innerHTML = "Loading...";
async function fetchBookDetails(bookId) {
  try {
    const response = await fetch(`https://gutendex.com/books/${bookId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Book with ID ${bookId} not found.`);
      } else {
        throw new Error(`Error fetching book details: ${response.statusText}`);
      }
    }
    const bookData = await response.json();
    displayBookDetails(bookData);
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    displayErrorMessage(error.message);
  }
}

function displayBookDetails(bookData) {
  breadcrumbProductTitle.innerHTML = bookData.title;
  bookDetailsElement.innerHTML = `
      <div class="details_content">
        <div class="image_wrapper">
          <img src="${bookData.formats["image/jpeg"]}" alt="${
    bookData.title
  } cover image" />
        </div>
        <div class="info_wrapper">
        <h2>${bookData.title}</h2>
      <p>
      <strong>Author:</strong> ${bookData.authors
        .map((author) => author.name)
        .join(", ")}
        </p>
      <p>
      <p>
      <strong>Languages:</strong> ${bookData.languages}
        </p>
      <p>
      <strong>Description:</strong> ${
        bookData.description || "No description available."
      }
      </p>
    
        </div>
      </div>
    `;
}

function displayErrorMessage(message) {
  const errorElement = document.getElementById("error_message");
  if (errorElement) {
    errorElement.textContent = message;
  } else {
    console.error("Error element not found for displaying the message.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (bookId) {
    fetchBookDetails(bookId);
  } else {
    displayErrorMessage("Book ID is missing in the URL.");
  }
});
