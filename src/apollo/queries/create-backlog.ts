import { gql } from '@apollo/client';

export const ADD_BACKLOG = gql`
  mutation AddBacklog(
    $task: String!
    $type: String!
    $estimation: Int!
    $user_id: ID
    $status_id: ID!
  ) {
    createBacklog(
      task: $task
      type: $type
      estimation: $estimation
      user_id: $user_id
      status_id: $status_id
    ) {
      id
      task
      type
      estimation
      user_id
      status_id
    }
  }
`;
