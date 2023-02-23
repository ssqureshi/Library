import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Genres = ({setGenre}) => {
  const result = useQuery(ALL_BOOKS)
 
  const genres = result.data.allBooks
    .map(g => g.genres)
    .flatMap(x => x)
    .filter((value, index, array) => array.indexOf(value) === index).concat("all")

  const filterBooks = (g) => {
    setGenre(g)
  }

return (
  genres.map(
    g => {
      return <button onClick={() => filterBooks(g)} key={g}>{g}</button>
    }
  )
)
}

export default Genres