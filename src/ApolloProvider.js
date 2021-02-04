import React from 'react'
import App from './App'

import { setContext } from 'apollo-link-context'
import { persistCacheSync, SessionStorageWrapper } from 'apollo3-cache-persist'
import { 
  ApolloClient, 
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from '@apollo/react-hooks'

import { typePolicies } from './util/cache.conf'
const cache = new InMemoryCache({
  typePolicies
})

persistCacheSync({
  cache,
  storage: new SessionStorageWrapper(window.sessionStorage)
})

const httpLink = new HttpLink({
  uri: 'http://fathomless-brushlands-63528.herokuapp.com/'
})

const authLinkSync = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  cache,
  link: authLinkSync.concat(httpLink)
})


export default (
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)
