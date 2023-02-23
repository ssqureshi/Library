import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'
import Genres from './Genres'

const Books = (props) => {
  const [genre, setGenre] = useState("all")
  const [books, setBooks] = useState({})
  const result = useQuery(ALL_BOOKS)
  const genreResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: genre === "all",
  })
  
  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);
    }
  }, [result.data, genre])

  useEffect(() => {
    if (genreResult.data) {
      setBooks(genreResult.data.allBooks);
    }
  }, [genreResult.data])

  if (!props.show) {
    return null
  }
  if (result.loading || genreResult.loading) {
    return <div>loading...</div>
  }
  
  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Genres setGenre={setGenre} />
    </div>
  )
}

export default Books
