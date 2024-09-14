import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'
import BookList from './BookList'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE,{
    variables: { genre },
    skip: !genre,
  })

  if (!props.show) {
    return null
  }

  if (booksByGenreResult.loading) {
    return <div>Loading data...</div>
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

      {genre &&
        <div>
          in genre <strong>{genre}</strong>
        </div>
      }

      <BookList books={genre ? booksByGenreResult.data.allBooks : books} />

      <h3>Filter by genre: </h3>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
      ))}
      <button onClick={() => setGenre('')}>all genres</button>
    </div>
  )
}

export default Books
