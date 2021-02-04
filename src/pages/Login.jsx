import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Button } from 'semantic-ui-react'

// Utils
import { useForm } from '../util/hooks'
import { LOGIN_USER } from '../util/graphql'

// Context
import { AuthContext } from '../context/auth'

function Login(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState([])
  const initValue = {
    username: '',
    email: ''
  }
  const { onChange, onSubmit, values } = useForm(loginUserCallback, initValue)

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData }}) {
      context.login(userData)
      props.history.push('/')
    },
    onError(err) {
      console.error(err)
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

  function loginUserCallback() { loginUser() }


  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={ loading ? "loading": '' }>
        <h1>Login</h1>
        <Form.Input 
          label="Username" 
          placeholder="Username..." 
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
          name="username" />

        <Form.Input 
          type="password"
          label="Password" 
          placeholder="Password..." 
          value={values.Password}
          onChange={onChange}
          error={errors.password ? true : false}
          name="password" />

        <Button type="submit" primary>
          Login
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

export default Login

