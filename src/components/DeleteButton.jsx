import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/react-hooks'
import { Button, Confirm, Icon } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup'

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  function removePostFromCache(proxy, postId) {
      // remove post from cache
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY })
      proxy.writeQuery({ 
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter(post => post._id !== postId)
        }
      })
  }

  const [deletePostOrComment] = useMutation(mutation, {
    onErrors(){},
    variables: { postId, commentId },
    update(proxy){
      // close Confirm box
      setConfirmOpen(false)

      // call callback
      if(callback && typeof callback === "function") callback()

      return !commentId &&
        removePostFromCache(proxy, postId)  
      
    },
  })

  function deletePostOrCommentCustom() {
    if (!confirmed) deletePostOrComment()
    setConfirmed(true)
  }

  return (<>
    <MyPopup content={ commentId ? "Delete comment" : "Delete post" }>
      <Button as="div" color="red" 
        floated="right"
        onClick={setConfirmOpen.bind(null, true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
    </MyPopup>
    
    <Confirm
      open={confirmOpen}
      onConfirm={deletePostOrCommentCustom}
      onCancel={setConfirmOpen.bind(null, false)} 
    />
  </>)
}

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      _id
      comments { _id username body createdAt }
      commentCount
    }
  }
`

export default DeleteButton
