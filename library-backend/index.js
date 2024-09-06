require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int
    id: ID!
    born: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async () => {
      /*
        let filteredBooks = [...books]
        if (args.author) {
          filteredBooks = filteredBooks.filter((book) => book.author === args.author)
        }
        if (args.genre) {
          filteredBooks = filteredBooks.filter((book) => book.genres.includes(args.genre))
        }
        return filteredBooks
      */
      return Book.find({}).populate("author")
    },
    allAuthors: async () => {
      return Author.find({})
    }
  },
  /*
  Author: {
    bookCount: (root) => books.reduce((count, book) =>
      book.author === root.name ? ++count : count, 0)
  },
  */
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      const book = new Book({
        ...args,
        author: author
      })
      return book.save()
    },

    /*
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      const updatedAuthor = {...author, born: args.setBornTo}
      authors = authors.map(a => a.name === args.name
        ? updatedAuthor
        : a
      )
      return updatedAuthor
    }
    */
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
