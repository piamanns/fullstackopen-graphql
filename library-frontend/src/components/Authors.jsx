import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'

const Authors = (props) => {
  const [authorName, setAuthorName] = useState('')
  const [authorBorn, setAuthorBorn] = useState('')
  const [ editBirthYear ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  useEffect(() => {
    if (props.authors.length > 0) {
      setAuthorName(props.authors[0].name)
    }
  }, [props.authors])

  if (!props.show) {
    return null
  }

  const authors = props.authors

  const submitAuthorData = async (event) => {
    event.preventDefault()
    editBirthYear({ variables: {name: authorName, setBornTo: parseInt(authorBorn)} })

    setAuthorName('')
    setAuthorBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submitAuthorData}>
        <div>
          <label>
            name
            <select
              value={authorName}
              onChange={({ target }) => setAuthorName(target.value)}
            >
              {authors.map((a) => (
                <option key={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          born
          <input
            value={authorBorn}
            onChange={({ target }) => setAuthorBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
