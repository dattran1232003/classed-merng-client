import { gql } from '@apollo/react-hooks'

export const CREATE_POST_MUTATION = gql`
mutation CreatePost($body: String!){
  createPost(body: $body) {
    _id body createdAt username
    likes {
      _id username createdAt
    }
    likeCount
    comments {
      _id body username createdAt
    }
    commentCount
  }
}
`

export const FETCH_POSTS_QUERY = gql`
{
  getPosts{
    _id body createdAt username likeCount
    likes {
      username
    }
    commentCount
    comments {
      _id username createdAt body
    }
  }
}
`

export const LOGIN_USER = gql`
mutation Login(
  $username: String!
  $password: String!
) {
  login(
    username: $username
    password: $password
  ) {
    _id email username token createdAt
  }
}
`
