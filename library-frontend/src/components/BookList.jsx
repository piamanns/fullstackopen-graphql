const BookList = ({ books, filter }) => {
  return(
    <table>
    <tbody>
      <tr>
        <th></th>
        <th>author</th>
        <th>published</th>
      </tr>
      {books
        .filter((book) => filter ? book.genres.includes(filter) : book)
        .map((book) => (
          <tr key={book.title}>
            <td>{book.title}</td>
            <td>{book.author.name}</td>
            <td>{book.published}</td>
          </tr>
        ))
      }
    </tbody>
  </table>

  )
}

export default BookList
