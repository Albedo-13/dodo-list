import './index.css';

import { ApolloProvider } from '@apollo/client';
import { App } from '@components/app/app';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { clientApollo } from './apollo/init';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={clientApollo}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
