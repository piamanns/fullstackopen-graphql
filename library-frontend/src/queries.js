import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String!){
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
    }
  }
`

export const FAVORITE_GENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String]) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
        ...BookDetails
      }
  }
  ${BOOK_DETAILS}
`

export const EDIT_BIRTHYEAR = gql`
  mutation editBirthYear($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
        name
        born
        bookCount
      }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
