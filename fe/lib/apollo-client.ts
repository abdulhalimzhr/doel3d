import {
  ApolloClient,
  InMemoryCache,
  ApolloError
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

// Create upload link for file uploads
const uploadLink = createUploadLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    'http://localhost:4000/graphql'
});

// Create auth link (if needed for future authentication)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers
      // Add any auth headers here in the future
    }
  };
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

// Error handler utility
export const handleGraphQLError = (error: ApolloError) => {
  console.error('GraphQL Error:', error);

  if (error.networkError) {
    console.error('Network Error:', error.networkError);
    return 'Terjadi kesalahan jaringan. Pastikan server backend berjalan.';
  }

  if (error.graphQLErrors?.length > 0) {
    console.error('GraphQL Errors:', error.graphQLErrors);
    return (
      error.graphQLErrors[0].message ||
      'Terjadi kesalahan saat memproses permintaan.'
    );
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
};
