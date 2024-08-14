import { SDKProvider } from '@telegram-apps/sdk-react';
import { type FC } from 'react';

import { App } from './App';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const Inner: FC = () => {

  return (
      <SDKProvider acceptCustomStyles>
        <App/>
      </SDKProvider>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner/>
  </ErrorBoundary>
);
