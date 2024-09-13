import { useState } from 'react'
import BookList from './BookList'

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

      <BookList books={books} filter={filter} />

      <h3>Filter by genre: </h3>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books
