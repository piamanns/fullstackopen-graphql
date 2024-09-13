import { useQuery } from "@apollo/client"
import { FAVORITE_GENRE } from "../queries"
import BookList from "./BookList"

const Recommendations = ({ books, show, token }) => {
  const favGenreResult = useQuery(FAVORITE_GENRE,{
    variables: { token },
    skip: !token
  })

  if (!show || !token) {
    return null
  }

  if (favGenreResult.loading) {
    return <div>Loading data...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        in your favorite genre <strong>{favGenreResult.data.me.favoriteGenre}</strong>
      </div>
      <BookList books={books} filter={favGenreResult.data.me.favoriteGenre}/>
    </div>
  )
}

export default Recommendations
