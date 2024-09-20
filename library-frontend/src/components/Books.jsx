import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'
import BookList from './BookList'

const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState('')
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: '' },
    notifyOnNetworkStatusChange: true
  })

  if (!props.show) {
    return null
  }

  if (booksByGenreResult.loading) {
    return <div>Loading data...</div>
  }

  const genres = props.books.reduce((genreList, book) => {
    if (book.genres) {
      book.genres.forEach(genre => {
        if (!genreList.includes(genre)) {
          genreList.push(genre);
        }
      })
    }
    return genreList;
  }, []);

  const switchGenre = (genre) => {
    booksByGenreResult.refetch({ genre })
    setCurrentGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>

      {currentGenre &&
        <div>
          in genre <strong>{currentGenre}</strong>
        </div>
      }

      <BookList books={currentGenre
        ? booksByGenreResult.data.allBooks
        : props.books
      } />

      <h3>Filter by genre: </h3>
      {genres.map((genre) => (
        <button key={genre} onClick={() => switchGenre(genre)}>{genre}</button>
      ))}
      <button onClick={() => setCurrentGenre('')}>all genres</button>
    </div>
  )
}

export default Books
