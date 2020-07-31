import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://graphqlzero.almansi.me/api',
  cache
})
ReactDOM.render(
  <ApolloProvider client={client} >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
