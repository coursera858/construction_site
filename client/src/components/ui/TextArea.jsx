import React from 'react'

const TextArea = ({ name, placeholder, register, error }) => {
    return (
        <div className="custom-textarea">
            <label htmlFor={name}>{placeholder}</label>
            <textarea
                placeholder={placeholder}
                {...register(name)}
                id={name}
            />
            {error[name] &&
                <span className="error">{error[name].message}</span>}
        </div>
    )
}

export default TextArea