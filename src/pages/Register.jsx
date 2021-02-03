import React, { useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/react-hooks'
import { Form, Button } from 'semantic-ui-react'

import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

function Register(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState([])
  const initState = {
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  }
  const { onChange, onSubmit, values } = useForm(registerUser, { ...initState })

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }){
      context.login(userData)
      props.history.push('/')
    },
    onError(err) {
      setErrors(
        err?.graphQLErrors[0]?.extensions?.exception?.errors ||
        err?.graphQLErrors[0]?.extensions?.errors || []
      )
    },
    variables: {
      email: values.email,
      username: values.username,
      password: values.password,
      confirmPassword: values.confirm_password
    }
  })

  function registerUser() { addUser() }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={ loading ? "loading": '' }>
        <h1>Register</h1>
        <Form.Input 
          label="Username" 
          placeholder="Username..." 
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
          name="username" />

        <Form.Input 
          type="email"
          label="Email" 
          placeholder="Email..." 
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
          name="email" />

        <Form.Input 
          type="password"
          label="Password" 
          placeholder="Password..." 
          value={values.Password}
          onChange={onChange}
          error={errors.password ? true : false}
          name="password" />

        <Form.Input 
          type="password"
          label="Confirm Password" 
          placeholder="Confirm Password..." 
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
          name="confirm_password" />

        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      { Object.keys(errors).length > 0  && (
        <div className="ui error message">
          <ul className="list">
            { Object.values(errors).map(error => <li key={error[0]}>{error[0]}</li>) }
          </ul>
        </div>
      )}
    </div>
  )

}

const REGISTER_USER = gql`
mutation Register(
  $email: String!
  $username: String!
  $password: String!
  $confirmPassword: String!
) {
  register(registerInput: {
    email: $email
    username: $username
    password: $password
    confirmPassword: $confirmPassword
  }) {
    _id email username token createdAt
  }
}
`

export default Register

