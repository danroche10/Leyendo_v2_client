import gql from "graphql-tag";

export const FETCH_ESSAYS_QUERY = gql`
  {
    getEssays {
      _id
      title
      author

      likeCount
      likes {
        username
      }
      commentCount
      comments {
        _id
        username
        createdAt
        body
      }
    }
  }
`;
