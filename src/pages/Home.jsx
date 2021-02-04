import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid, Button, Transition, Loader } from 'semantic-ui-react'

// Components
import { AuthContext } from '../context/auth'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'

// Utils
import { FETCH_POSTS_QUERY } from '../util/graphql'

function Home() {
  const { user } = useContext(AuthContext)
  const { loading, data, error, refetch } = useQuery(FETCH_POSTS_QUERY)
  console.log(loading, data || error)

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>

      <Grid.Row className="refetch">
        <Button onClick={() => refetch()}>Update</Button>
      </Grid.Row>

      <Grid.Row>
        { user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        ) }
        { loading ? <Loader active inline="centered" /> : (
          <Transition.Group>
            { !loading && data?.getPosts && data.getPosts?.map(post => (
              <Grid.Column key={post._id} style={{marginBottom: 20}}>
                <PostCard post={post}></PostCard>
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )

}


export default Home

