import { gql } from '@apollo/client';

export const TOGGLE_BACKLOG = gql`
  mutation ToggleBacklog($id: ID!, $isDone: Boolean!, $status_id: ID!) {
    updateBacklog(id: $id, isDone: $isDone, status_id: $status_id) {
      id
      isDone
      status_id
    }
  }
`;
