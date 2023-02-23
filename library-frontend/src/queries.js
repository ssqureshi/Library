import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  author {
    name
  }
  published
  genres
}
`

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born 
    bookCount
  }
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
query allBooks($author: String, $genre: String) {
  allBooks (author: $author genre: $genre) {
    ...BookDetails
}
}
${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
mutation createBook( 
  $title: String!
  $published: Int!
  $author: String!
  $genres: [String!]!) {
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

export const EDIT_AUTHOR = gql`
  mutation updateAuthor(
    $name: String!
    $born: Int!
  ) {
    editAuthor(
    name: $name,
    setBornTo: $born
    ) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const USER = gql`
  query {
    me {
      favouriteGenre
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