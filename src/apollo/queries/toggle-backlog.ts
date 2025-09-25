import { gql } from '@apollo/client';

export const TOGGLE_BACKLOG = gql`
  mutation ToggleBacklog($id: ID!, $status_id: ID!) {
    updateBacklog(id: $id, status_id: $status_id) {
      id
      status_id
    }
  }
`;
