import { gql } from '@apollo/client';

export const EDIT_BACKLOG = gql`
  mutation EditBacklog(
    $id: ID!
    $task: String!
    $type: String!
    $isDone: Boolean!
    $estimation: Int!
    $user_id: ID
    $status_id: ID!
  ) {
    updateBacklog(
      id: $id
      task: $task
      type: $type
      isDone: $isDone
      estimation: $estimation
      user_id: $user_id
      status_id: $status_id
    ) {
      id
      task
      type
      isDone
      estimation
      user_id
      status_id
    }
  }
`;
