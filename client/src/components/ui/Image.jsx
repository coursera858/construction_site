import React from 'react'
import { MdOutlineImage } from 'react-icons/md'

const Image = ({ setValue, error, name }) => {

    const handleChange = (e) => {
        console.log(e.target.files[0])
            setValue(name, "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D")
    }
    return (
        <div className="custom-image">
            <label htmlFor="image">
                <div className="image-holder">
                    <MdOutlineImage />
                    <span>please select an image</span>
                </div>
            </label>
            <input type="file" id='image' onChange={handleChange} />
            {error[name] &&
                <span className="error">{error[name].message}</span>}
        </div>
    )
}

export default Image