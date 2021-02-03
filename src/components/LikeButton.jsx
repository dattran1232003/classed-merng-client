import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { gql, useMutation } from '@apollo/react-hooks'
import { Button, Icon, Label } from 'semantic-ui-react'

import MyPopup from '../util/MyPopup'
import { AuthContext } from '../context/auth'

function LikeButton({ post }) {
  const { _id, likes, likeCount } = post
  const [liked, setLiked] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if(user)
      setLiked(!!likes.find(like => like.username === user.username))
  }, [likes, user])

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId: _id
    },
    onError(){}
  })

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
      <Button as={Link} to='/login' color="teal">
        <Icon name="heart" />
      </Button>
  )

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <MyPopup content={liked ? 'Unlike' : 'Like'}>
        {likeButton}
      </MyPopup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  )
}

const LIKE_POST_MUTATION = gql`
mutation LikePost($postId: ID!){
  likePost(postId: $postId) {
    _id
    likeCount
    likes {
      _id username
    }
  }
}
`

export default LikeButton
