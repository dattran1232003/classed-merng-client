import { useState } from 'react'

export const useForm = (cb, initialState={}) => {
  const [values, setValues] = useState(initialState)

  const onChange = event => 
    setValues({ ...values, [event.target.name]: event.target.value })

  const onSubmit = event => {
    event.preventDefault()
    cb()
  }
  return {
    onChange,
    onSubmit,
    values
  }
}
