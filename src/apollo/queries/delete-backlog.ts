import { gql } from '@apollo/client';

export const DELETE_BACKLOG = gql`
    mutation DeleteBacklog($id: ID!) {
    deleteBacklog(id: $id) {
      id
    }
  }
`;
