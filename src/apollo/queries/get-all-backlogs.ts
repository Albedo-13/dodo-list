import { gql } from '@apollo/client';

export const GET_ALL_BACKLOGS = gql`
  query GetAllBacklogs {
    allBacklogs {
      id
      task
      type
      estimation
      isDone
      status: Status {
        name
        key
        color
      }
      user: User {
        name
      }
    }
  }
`;
