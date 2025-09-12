import './index.css';

import { ApolloProvider } from '@apollo/client';
import { App } from '@components/app/app';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { clientApollo } from './apollo/init';

const ParticlesContainer = lazy(() =>
  import('./components/particles-container/particles-container').then(
    (module) => ({ default: module.ParticlesContainer })
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={clientApollo}>
      <Suspense fallback={null}>
        <ParticlesContainer />
      </Suspense>
      <App />
    </ApolloProvider>
  </StrictMode>
);
