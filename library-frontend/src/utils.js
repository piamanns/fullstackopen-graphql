export const updateCachedBooks = (cache, query, addedBook) => {

  const uniqueByTitleAuthor = (books) => {
    const seen = new Map()
    return books.filter((book) => {
      const title = book.title
      return seen.has(title) && seen.get(title).author == book.author.name
        ? false
        : seen.set(title, { author: book.author.name })
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByTitleAuthor(allBooks.concat(addedBook)),
    }
  })
}
