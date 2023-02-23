import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import { ALL_BOOKS, BOOK_ADDED, USER } from './queries'


const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

export const updateCache = (cache, query, addedBook) => {
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: allBooks.concat(addedBook)
    }
  })
}
const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  let genre

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token'))
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`Book titled ${addedBook.title} added successfully`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const user = useQuery(USER, {
    skip: !token,
  })
  if (user.loading) {
    return <div>loading...</div>
  }
  if (user.data) {
  genre = user.data.me.favouriteGenre
  }
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
          )
          :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Notify errorMessage={errorMessage} />

      <Login setError={notify} setToken={setToken} show={page === 'login'}/>
  
      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommended genre={genre} show={page === 'recommended'} />
    </div>
  )
}

export default App
