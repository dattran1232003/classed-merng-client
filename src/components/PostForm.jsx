import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'

// Utils
import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from '../util/graphql'

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  })
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    onError(e){console.error(e)},
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      proxy.writeQuery({ 
        query: FETCH_POSTS_QUERY, 
        data: {
          getPosts: [ result.data.createPost, ...data.getPosts] 
        }
      })
      values.body = ''
    },
  })

  function createPostCallback() { createPost() }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input 
            placeholder="Write Something..."
            name="body"
            onChange={onChange}
            value={values.body}
            error={!!error}
          />      

          <Button type="submit" color="teal">Submit</Button>
        </Form.Field>
      </Form>

      { error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <li>{ error?.graphQLErrors[0].message || null }</li>
        </div>
      )}
    </>
  )
}

export default PostForm
