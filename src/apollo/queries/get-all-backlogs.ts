import { gql } from '@apollo/client';

export const GET_ALL_BACKLOGS = gql`
  query GetAllBacklogs {
    allBacklogs(sortField: "id", sortOrder: "desc") {
      id
      task
      type
      estimation
      status: Status {
        id
        name
        key
        color
      }
      user: User {
        id
        name
      }
    }
  }
`;
