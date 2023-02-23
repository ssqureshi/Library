const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const _ = require("lodash")
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

let books
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const filtered = _.filter(books, {'author': args.author})
        return _.filter(filtered, b => { return b.genres.includes(args.genre)})
      }
      if (args.author) {
       return _.filter(books, {'author': args.author})
      }
      if (args.genre) {
        const books = await Book.find({ "genres" : { $in: args.genre}}).populate('author', {name: 1 })
        return books
      }
       return books
    },
    allAuthors: async () => {
      books = await Book.find({}).populate('author', {name: 1 })
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (root) => {
      const count =  _.countBy(books, "author.name")
      return count[root.name]
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.currentUser) {
        throw new GraphQLError('You are not authorized to perform this action.', {
          extensions: {
            code: 'FORBIDDEN',
          }
        })
      }
      let author = await Author.findOne({'name': args.author})
      if (!author) {
         author = new Author({
          name: args.author,
          bookCount: 1
        })
        try {
          await author.save()
        }
        catch (error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const book = new Book({...args, author})
      try {
        await book.save()
      }
      catch (error) {
         
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('You are not authorized to perform this action.', {
          extensions: {
            code: 'FORBIDDEN',
          }
        })
      }
      try {
        const author = await Author.findOneAndUpdate({'name': args.name}, {born: args.setBornTo}, {new:true})
        return author
      }
      catch {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre})
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers