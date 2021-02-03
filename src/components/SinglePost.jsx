import React, { useContext, useState, useRef } from 'react'

import moment from 'moment'
import { gql, useQuery, useMutation } from  '@apollo/react-hooks'
import { 
  Grid, Loader, Image, Form,
  Card, Button, Icon, Label } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import { LikeButton, DeleteButton } from '../components'
import MyPopup from '../util/MyPopup'

function SinglePost(props) {
  const [commentBody, setCommentBody] = useState('')
  const commentInputRef = useRef(null)
  const postId = props.match.params.postId
  const { user } = useContext(AuthContext)

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  })
  
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: { postId, body: commentBody },
    update(){
      setCommentBody('')
      commentInputRef.current.blur()
    }
  })

  function deletePostCallback(){
    props.history.push('/')
  }
  
  const postMarkup = loading ? (
    <Loader active inline="centered" />
  ) : (
    function({ 
      _id, username, body, createdAt, likeCount, commentCount, likes, comments 
    }) {
      return <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              floated="right"
            />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{ _id, likes, likeCount }}/>
                <MyPopup content="Comment on post">
                  <Button as='div' labelPosition="right"
                    onClick={() => console.log('Comment on post')}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>

                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                { user?.username === username && 
                <DeleteButton postId={_id} callback={deletePostCallback}/>
                }
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text" 
                        placeholder="Comment..."
                        name="comment"
                        value={commentBody}
                        onChange={event => setCommentBody(event.target.value)} 
                        ref={commentInputRef}
                      />

                      <button type="submit"
                        className="ui button teal"
                        disabled={commentBody.trim() === ""}
                        onClick={submitComment}
                      >Post</button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            { comments.map(comment => (
              <Card fluid key={comment._id}>
                <Card.Content>
                  { user?.username === comment?.username && (
                    <DeleteButton postId={_id} commentId={comment._id}/>
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            )) }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    }
  )(data.getPost) // anonymous function

  return postMarkup
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!){
    getPost(postId: $postId){
      _id body createdAt username likeCount
      likes { username }
      commentCount
      comments { _id username createdAt body }
    }
  }
`

const SUBMIT_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) { 
      _id
      comments { _id body createdAt username }
      commentCount
    }
  }
`

export default SinglePost
