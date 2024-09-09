require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')


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
    allBooks: async (root, args) => {
      /*
        let filteredBooks = [...books]
        if (args.author) {
          filteredBooks = filteredBooks.filter((book) => book.author === args.author)
        }
      */
      if (args.genre) {
        return Book.find({ genres: args.genre }).populate('author', 'name')
      }
      return Book.find({}).populate('author', 'name')
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
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Creating new author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const book = new Book({
        ...args,
        author: author
      })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Adding new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      return book
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      try {
        author.born = args.setBornTo
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing birth year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
    }
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
