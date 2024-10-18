(async () => {
  const url = "https://gutendex.com/books";
  const booksPerPage = 8;
  let currentPage = 0;
  let booksData = [];
  let filteredBooksData = [];
  /* *** wishlist icons *** */
  const wishListIcon = "assets/images/wishlist_stroke.png";
  const wishListedIcon = "assets/images/wishlist_fill.png";

  /* select element */
  const select_elements = {
    book_list: document.getElementById("book_list"),
    pagination: document.getElementById("pagination"),
    search_input: document.getElementById("search_input"),
    genre_filter: document.getElementById("genre_filter"),
  };
  const { book_list, pagination, search_input, genre_filter } = select_elements;
  book_list.innerHTML = "Loading...";
  pagination.innerHTML = "Loading...";

  /* fetch API */
  const fetchBooks = async () => {
    let getBooksFromLocalStorage = localStorage.getItem("booksData");

    if (getBooksFromLocalStorage) {
      booksData = JSON.parse(getBooksFromLocalStorage);
      filteredBooksData = [...booksData];
      populateGenres();
      displayPage();
    } else {
      const response = await fetch(url);
      const data = await response.json();
      booksData = data.results;
      filteredBooksData = [...booksData];
      localStorage.setItem("booksData", JSON.stringify(booksData));
      populateGenres();
      displayPage();
    }
  };

  /* function to display the books on the current page */
  function displayPage() {
    const startIndex = currentPage * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    if (!filteredBooksData.length) {
      book_list.innerHTML = "<h2>No books found.</h2>";
      return;
    }
    booksCard(filteredBooksData.slice(startIndex, endIndex));
    updatePagination();
  }

  /* function to toggle the wishlist status of a book */
  window.toggleWishlist = function (book) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingBookIndex = wishlist.findIndex((item) => item.id === book.id);

    if (existingBookIndex > -1) {
      wishlist.splice(existingBookIndex, 1);
    } else {
      wishlist.push(book);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayPage();
  };

  /* function to generate HTML for each book card and display them */
  function booksCard(books) {
    let bookCards = "";

    books.forEach((book) => {
      const isWishListed = isBookWishListed(book.id);
      bookCards += `
        <div class="book_card">
            <div class="book_image">
                <img src="${book?.formats["image/jpeg"]}" lazy="loading"/>
            </div>
            <div class="book_info">
                <h3><a href="/details.html?id=${book.id}">${book.title}</a></h3>
                <p><strong>Author:</strong> ${
                  book?.authors[0]?.name || "Unknown"
                }</p>
                <p><strong>Genre:</strong> ${
                  book?.subjects.length > 0 ? book.subjects[0] : "Not specified"
                }</p>
            </div>
            <button class="wishlist" onclick="toggleWishlist(${JSON.stringify(
              book
            ).replace(/"/g, "&quot;")})">
                <img src="${isWishListed ? wishListedIcon : wishListIcon}" />
            </button>
        </div>
      `;
    });
    book_list.innerHTML = bookCards;
  }

  /* function to check if a book is wishlisted */
  function isBookWishListed(bookId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === bookId);
  }

  /*  update pagination buttons Prev and Next */
  function updatePagination() {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredBooksData.length / booksPerPage);

    /* prev button */
    const prevButton = document.createElement("button");
    prevButton.className = "prev";
    prevButton.textContent = "Prev";
    prevButton.disabled = currentPage === 0;
    prevButton.addEventListener("click", () => {
      currentPage--;
      displayPage();
    });
    pagination.appendChild(prevButton);

    /* next button */
    const nextButton = document.createElement("button");
    nextButton.className = "next";
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage >= totalPages - 1;
    nextButton.addEventListener("click", () => {
      currentPage++;
      displayPage();
    });
    pagination.appendChild(nextButton);
  }

  /* function to populate genres in the genre filter dropdown */
  function populateGenres() {
    const genres = new Set();
    booksData.forEach((book) => {
      book.subjects.forEach((subject) => genres.add(subject));
    });

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genre_filter.appendChild(option);
    });
  }

  /* event listener for search input */
  search_input.addEventListener("input", () => {
    filterBooks();
  });

  genre_filter.addEventListener("change", () => {
    filterBooks();
  });

  function filterBooks() {
    const searchTerm = search_input.value.toLowerCase();
    const selectedGenre = genre_filter.value;

    filteredBooksData = booksData.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm);
      const matchesGenre = selectedGenre
        ? book.subjects.includes(selectedGenre)
        : true;
      return matchesSearch && matchesGenre;
    });

    currentPage = 0;
    /* display filtered books */
    displayPage();
  }

  /* fetch books when page loads */
  await fetchBooks();
})();
