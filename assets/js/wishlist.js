let wishlistBooksList = document.getElementById("wishlist_book_list");
const wishListIcon = "assets/images/wishlist_stroke.png";
const wishListedIcon = "assets/images/wishlist_fill.png";

window.toggleWishlist = function (book) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const existingBookIndex = wishlist.findIndex((item) => item.id === book.id);

  if (existingBookIndex > -1) {
    wishlist.splice(existingBookIndex, 1);
  } else {
    wishlist.push(book);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  wishListBookCard();
};

function wishlistBooksCard(books) {
  let bookCards = "";
  books.forEach((book) => {
    const isWishListed = isBookWishListed(book.id);
    bookCards += `
      <div class="book_card">
        <div class="book_image">
          <img src="${book?.formats["image/jpeg"]}" loading="lazy" alt="${
      book.title
    }"/>
        </div>
        <div class="book_info">
          <h3><a href="/details.html?id=${book.id}">${book.title} </a/</h3>
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
  wishlistBooksList.innerHTML = bookCards;
}
function wishListBookCard() {
  const wishlistBooks = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlistBooks.length > 0) {
    wishlistBooksCard(wishlistBooks);
  } else {
    wishlistBooksList.innerHTML = "<p>No books in wishlist</p>";
  }
}
function isBookWishListed(bookId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.some((item) => item.id === bookId);
}
document.addEventListener("DOMContentLoaded", wishListBookCard);
