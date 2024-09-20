import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import Authors from "./components/Authors";
import Books from "./components/Books";
import Recommendations from "./components/Recommendations";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const bookAdded = data.data.bookAdded
      window.alert(`${bookAdded.title} added`)
    }
  })

  if (authorsResult.loading || booksResult.loading) {
    return <div>Loading data...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token &&
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        }
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors
        show={page === "authors"}
        authors={authorsResult.data.allAuthors}
        token={token}
      />

      <Books show={page === "books"} books={booksResult.data.allBooks} key={token} />

      <Recommendations show={page === "recommendations"} books={booksResult.data.allBooks} token={token} />

      <NewBook show={page === "add"} />

      <LoginForm show={page === "login"} setToken={setToken}/>
    </div>
  );
};

export default App;
