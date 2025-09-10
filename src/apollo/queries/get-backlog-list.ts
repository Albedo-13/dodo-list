import { gql } from '@apollo/client';

export const GET_BACKLOG_LIST = gql`
  query GetBacklogList {
    allBacklogs {
      id
      task
      type
      estimation
      isDone
      status: Status {
        name
        icon
        color
      }
      user: User {
        name
      }
    }
  }
`;
