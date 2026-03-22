import React from 'react'

const Input = ({ type = "text", name, placeholder, register, error = {} }) => {
  return (
    <div className="input">
      <label htmlFor={name}>{placeholder}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        id={name}
      />
      {error[name] &&
        <span className="error">{error[name].message}</span>}
    </div>
  )
}

export default Input