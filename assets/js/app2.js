(async () => {
  const url = "https://gutendex.com/books/";
  let booksData = [];

  const select_elements = {
    content: document.getElementById("content"),
    homeLink: document.getElementById("home"),
    wishlistLink: document.getElementById("wishlist"),
  };

  const fetchBooks = async () => {
    const response = await fetch(url);
    const data = await response.json();
    booksData = data.results;
    displayHomePage();
  };

  const displayHomePage = () => {
    const booksHtml = booksData
      .map(
        (book) => `
            <div class="book_card">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${
                  book?.authors[0]?.name || "Unknown"
                }</p>
                <button onclick="viewBookDetails(${
                  book.id
                })">View Details</button>
                <div class="wishlist" onclick="toggleWishlist(${JSON.stringify(
                  book
                ).replace(/"/g, "&quot;")})">
                    <img src="${
                      isBookWishlisted(book.id)
                        ? "https://img.icons8.com/material-outlined/24/ff0000/like--v1.png"
                        : "https://img.icons8.com/material-outlined/24/ffffff/like--v1.png"
                    }" />
                </div>
            </div>
        `
      )
      .join("");
    select_elements.content.innerHTML = `<h1>Books</h1>${booksHtml}`;
  };

  const displayWishlistPage = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistHtml = wishlist.length
      ? wishlist
          .map(
            (book) => `
                <div class="book_card">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${
                      book?.authors[0]?.name || "Unknown"
                    }</p>
                    <button onclick="viewBookDetails(${
                      book.id
                    })">View Details</button>
                    <div class="wishlist" onclick="toggleWishlist(${JSON.stringify(
                      book
                    ).replace(/"/g, "&quot;")})">
                        <img src="https://img.icons8.com/material-outlined/24/ff0000/like--v1.png" />
                    </div>
                </div>
            `
          )
          .join("")
      : "<h3>Your wishlist is empty.</h3>";
    select_elements.content.innerHTML = `<h1>Wishlist</h1>${wishlistHtml}`;
  };

  const viewBookDetails = (bookId) => {
    const book = booksData.find((b) => b.id === bookId);
    const bookDetailsHtml = `
            <div class="book_details">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${
                  book?.authors[0]?.name || "Unknown"
                }</p>
                <p><strong>Description:</strong> ${
                  book?.description || "No description available."
                }</p>
                <button onclick="displayHomePage()">Back to Home</button>
            </div>
        `;
    select_elements.content.innerHTML = bookDetailsHtml;
  };

  window.toggleWishlist = function (book) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingBookIndex = wishlist.findIndex((item) => item.id === book.id);

    if (existingBookIndex > -1) {
      wishlist.splice(existingBookIndex, 1); // Remove from wishlist
    } else {
      wishlist.push(book); // Add entire book object to wishlist
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayHomePage(); // Refresh the display
  };

  function isBookWishlisted(bookId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === bookId); // Check if book is in the wishlist
  }

  // Event listeners for navigation
  select_elements.homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    displayHomePage();
  });

  select_elements.wishlistLink.addEventListener("click", (e) => {
    e.preventDefault();
    displayWishlistPage();
  });

  // Fetch books and display the homepage
  await fetchBooks();
})();
