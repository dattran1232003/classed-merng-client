import React, { useContext } from 'react'
import moment from 'moment'

import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react'

import { LikeButton, DeleteButton } from './'
import MyPopup from '../util/MyPopup'

const PostCard = ({ post }) => {
  const { _id, body, createdAt, likes, likeCount, username, commentCount } = post
  const { user } = useContext(AuthContext)

  return (<Card fluid>
    <Card.Content>
      <Image floated="right" 
        size="mini" 
        src="https://react.semantic-ui.com/images/avatar/large/molly.png" 
      />
      <Card.Header>{username}</Card.Header>
      <Card.Meta as={Link} to={`/posts/${_id}`}>
        {moment(createdAt).fromNow(true)}
      </Card.Meta>
      <Card.Description>{body}</Card.Description>
    </Card.Content>

    <Card.Content extra>
      <LikeButton 
        post={{ _id, likes, likeCount }}
      />

      <MyPopup content="Comment">
        <Button labelPosition="right" as={Link} to={`/post/${_id}`}>
          <Button basic color="blue">
            <Icon name="comments" />
          </Button>

          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </MyPopup>

      { user?.username === post.username && 
      <DeleteButton postId={_id} />
      }
    </Card.Content>
  </Card>)
}

export default PostCard
