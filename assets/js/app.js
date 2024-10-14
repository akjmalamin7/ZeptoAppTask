(async () => {
    const url = 'https://gutendex.com/books/';
    const booksPerPage = 5;
    let currentPage = 0;
    let booksData = [];

    const select_elements = {
        book_list: document.getElementById("book_list"),
        next_button: document.getElementById("next_button"),
        prev_button: document.getElementById("prev_button")
    };
    const getBooks = async () => {
        const response = await fetch(url);
        const data = await response.json();
        booksData = data.results;
    };

    const { book_list, next_button, prev_button } = select_elements;
    book_list.innerHTML = '<h1 style="color:#ffffff;">Loading...</h1>';

    function booksCard(books) {
        let bookCards = '';

        books.forEach((book) => {
            bookCards += `
                <div class="book_card">
                    <h3>${book.title}</h3>
                    <p>Author: ${book.authors.map(author => author.name).join(', ')}</p>
                    <p>Language: ${book.languages.join(', ')}</p>
                </div>
            `;
        });
        book_list.innerHTML = bookCards;
    }

    function displayPage() {
        const startIndex = currentPage * booksPerPage;
        const endIndex = startIndex + booksPerPage;

        if (!booksData.length) {
            book_list.innerHTML = '<h1 style="color:#ffffff;">Loading...</h1>';
        } else {
            booksCard(booksData.slice(startIndex, endIndex));
        }

        // Show or hide buttons based on the current page
        prev_button.className = currentPage > 0 ? 'show' : 'disabled';
        next_button.className = endIndex < booksData.length ? 'show' : 'disabled';
    }

    // Event listeners for pagination buttons
    next_button.addEventListener('click', () => {
        currentPage++;
        displayPage();
    });

    prev_button.addEventListener('click', () => {
        currentPage--;
        displayPage();
    });

    // Fetch books and display the first page
    await getBooks();
    displayPage();
})();
