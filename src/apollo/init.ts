import { ApolloClient, InMemoryCache } from '@apollo/client';

export const clientApollo = new ApolloClient({
  uri: 'http://localhost:3000/',
  cache: new InMemoryCache(),
});
