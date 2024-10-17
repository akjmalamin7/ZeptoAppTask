(async () => {
  const url = "https://gutendex.com/books";
  const booksPerPage = 8;
  let currentPage = 0;
  let booksData = [];
  let filteredBooksData = [];
  const wishListIcon = "assets/images/wishlist_stroke.png"; // Unliked icon
  const wishListedIcon = "assets/images/wishlist_fill.png"; // Liked icon

  const select_elements = {
    book_list: document.getElementById("book_list"),
    pagination: document.getElementById("pagination"),
    search_input: document.getElementById("search_input"),
    genre_filter: document.getElementById("genre_filter"),
  };

  const fetchBooks = async () => {
    let storedBooks = localStorage.getItem("booksData");

    if (storedBooks) {
      booksData = JSON.parse(storedBooks);
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

  const { book_list, pagination, search_input, genre_filter } = select_elements;

  function displayPage() {
    const startIndex = currentPage * booksPerPage;
    const endIndex = startIndex + booksPerPage;

    if (!filteredBooksData.length) {
      book_list.innerHTML = '<h2">No books found.</h2>';
      return;
    }
    booksCard(filteredBooksData.slice(startIndex, endIndex));
    updatePagination();
  }

  window.toggleWishlist = function (book) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingBookIndex = wishlist.findIndex((item) => item.id === book.id);

    if (existingBookIndex > -1) {
      wishlist.splice(existingBookIndex, 1); // Remove from wishlist
    } else {
      wishlist.push(book); // Add entire book object to wishlist
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayPage(); // Refresh display to show updated wishlist status
  };

  function booksCard(books) {
    let bookCards = "";

    books.forEach((book) => {
      const isWishlisted = isBookWishlisted(book.id); // Check if the book is in the wishlist
      bookCards += `
                <div class="book_card">
                    <div class="book_image">
                        <img src="${
                          book?.formats["image/jpeg"]
                        }" lazy="loading"/>
                    </div>
                    <div class="book_info">
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${
                          book?.authors[0]?.name || "Unknown"
                        }</p>
                        <p><strong>Genre:</strong> ${
                          book?.subjects.length > 0
                            ? book.subjects[0]
                            : "Not specified"
                        }</p>
                    </div>
                    <button class="wishlist" onclick="toggleWishlist(${JSON.stringify(
                      book
                    ).replace(/"/g, "&quot;")})">
                        <img src="${
                          isWishlisted ? wishListedIcon : wishListIcon
                        }" />
                    </button>
                </div>
            `;
    });
    book_list.innerHTML = bookCards;
  }

  function isBookWishlisted(bookId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.id === bookId); // Check if book is in the wishlist
  }

  function updatePagination() {
    pagination.innerHTML = ""; // Pagination Clear

    const totalPages = Math.ceil(filteredBooksData.length / booksPerPage);

    // Prev Button
    const prevButton = document.createElement("button");
    prevButton.className = "prev";
    prevButton.textContent = "Prev";
    prevButton.disabled = currentPage === 0;
    prevButton.onclick = () => {
      currentPage--;
      displayPage();
    };
    pagination.appendChild(prevButton);

    // Pagination Numbers
    const visiblePages = getVisiblePages(totalPages);
    visiblePages.forEach((num) => {
      pagination.appendChild(createPageNumber(num));
    });

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.className = "next";
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage >= totalPages - 1;
    nextButton.onclick = () => {
      currentPage++;
      displayPage();
    };
    pagination.appendChild(nextButton);
  }

  function getVisiblePages(totalPages) {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    // Show page numbers with '...'
    const visiblePages = [];

    if (currentPage < 3) {
      return pageNumbers.slice(0, 5);
    } else if (currentPage >= totalPages - 3) {
      return pageNumbers.slice(totalPages - 5);
    } else {
      visiblePages.push(1);
      if (currentPage > 3) visiblePages.push("...");
      visiblePages.push(currentPage - 1, currentPage, currentPage + 1);
      if (currentPage < totalPages - 2) visiblePages.push("...");
      visiblePages.push(totalPages);
      return visiblePages.filter((item, index) => {
        return (
          index === 0 || index === visiblePages.length - 1 || item !== "..."
        );
      });
    }
  }

  function createPageNumber(num) {
    const pageNumberButton = document.createElement("button");
    if (num === "...") {
      pageNumberButton.textContent = "...";
      pageNumberButton.disabled = true; // Disable ... button
    } else {
      pageNumberButton.textContent = num;
      pageNumberButton.onclick = () => {
        currentPage = num - 1; // 0-indexed
        displayPage();
      };
    }

    if (num === currentPage + 1) {
      pageNumberButton.classList.add("active"); // Add active class
    }

    return pageNumberButton;
  }

  // Populate genre filter dropdown
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

  // Event listener for search input
  search_input.addEventListener("input", (event) => {
    filterBooks();
  });

  // Event listener for genre filter
  genre_filter.addEventListener("change", (event) => {
    filterBooks();
  });

  // Function to filter books based on search and genre
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

    currentPage = 0; // Reset to the first page whenever filters change
    displayPage();
  }

  // Fetch books and display the first page
  await fetchBooks();
})();
