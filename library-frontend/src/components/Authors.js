import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const Authors = (props) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')
  const result = useQuery(ALL_AUTHORS)
  const [ updateAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS} ]
  })
  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors
  const options = authors.map(a => {
    return {value: a.name, label: a.name}
  })
  const handleEdit = (event) => {
    event.preventDefault()
    updateAuthor({ variables: {name, born} })
    setBorn('')
    setName('')
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
      <div>
        <h2>Set birtyear</h2>
        <form onSubmit={handleEdit}>
          <div>
            <Select 
              defaultValue={name}
              onChange={o => setName(o.value)}
              options={options}
            />
          </div>
          <div>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(parseInt(target.value))}
            />
          </div>
          <button type="submit">update author</button>        
        </form>
      </div>
    </div>
  )
}

export default Authors
