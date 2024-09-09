import { useState } from 'react'

const Books = (props) => {
  const [filter, setFilter] = useState('')

  if (!props.show) {
    return null
  }

  const books = props.books

  const genres = props.books.reduce((genreList, book) => {
    if (book.genres) {
      book.genres.forEach(genre => {
        if (!genreList.includes(genre)) {
          genreList.push(genre);
        }
      })
    };
    return genreList;
  }, []);

  return (
    <div>
      <h2>books</h2>

      {filter &&
        <div>
          in genre <strong>{filter}</strong>
        </div>
      }

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
      <h3>Filter by genre: </h3>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books
