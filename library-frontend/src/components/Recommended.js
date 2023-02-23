import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"


const Recommended = ({show, genre}) => {
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: genre === '',
  })

  if (!show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  return (
    <div>
      <h2>reccommendations</h2>
      <p>books in your favourite genre <strong>{genre}</strong></p>
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
    </div>
  )
}

export default Recommended