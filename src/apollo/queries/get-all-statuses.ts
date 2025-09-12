import { gql } from '@apollo/client';

export const GET_ALL_STATUSES = gql`
  query GetAllStatuses {
    allStatuses {
      id
      key
      name
      color
    }
  }
`;
