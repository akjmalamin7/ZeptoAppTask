// Fetching the element where wishlist books will be shown
let wishlistBooksList = document.getElementById("wishlist_book_list");
/* *** wishlist icons *** */
const wishListIcon = "assets/images/wishlist_stroke.png";
const wishListedIcon = "assets/images/wishlist_fill.png";
// Toggle Wishlist: Add or remove book from the wishlist
window.toggleWishlist = function (book) {
  // Get wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const existingBookIndex = wishlist.findIndex((item) => item.id === book.id);

  if (existingBookIndex > -1) {
    wishlist.splice(existingBookIndex, 1); // Remove book from wishlist if already present
  } else {
    wishlist.push(book); // Add entire book object to wishlist
  }

  // Update localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Update the wishlist view after adding/removing the book
  wishListBookCard(); // Refresh the list
};

// Function to generate wishlist book cards
function wishlistBooksCard(books) {
  let bookCards = ""; // Initializing card container

  books.forEach((book) => {
    const isWishListed = isBookWishListed(book.id); // Check if book is already wishlisted
    bookCards += `
      <div class="book_card">
        <div class="book_image">
          <img src="${book?.formats["image/jpeg"]}" loading="lazy" alt="${
      book.title
    }"/>
        </div>
        <div class="book_info">
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book?.authors[0]?.name || "Unknown"}</p>
          <p><strong>Genre:</strong> ${
            book?.subjects.length > 0 ? book.subjects[0] : "Not specified"
          }</p>
        </div>
        <button class="wishlist" onclick="toggleWishlist(${JSON.stringify(
          book
        ).replace(/"/g, "&quot;")})">
          <img src="${
            isWishListed ? wishListedIcon : wishListIcon
          }" alt="Wishlist Icon"/>
        </button>
      </div>
    `;
  });

  // Display the generated cards in the wishlistBooksList container
  wishlistBooksList.innerHTML = bookCards;
}

// Function to fetch and display wishlist books
function wishListBookCard() {
  const wishlistBooks = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlistBooks.length > 0) {
    wishlistBooksCard(wishlistBooks);
  } else {
    wishlistBooksList.innerHTML = "<p>No books in wishlist</p>";
  }
}

// Function to check if a book is wishlisted
function isBookWishListed(bookId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.some((item) => item.id === bookId); // Check if book is in the wishlist
}

// Initially load wishlist books when the page loads
document.addEventListener("DOMContentLoaded", wishListBookCard);
