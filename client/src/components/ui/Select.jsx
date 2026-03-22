import React, { useState, useEffect } from 'react'

const Select = ({ name, placeholder, options, setValue, error, value }) => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedValue, setSelectedValue] = useState('')

    useEffect(() => {
        if (value) {
            const currentOption = options.find(opt => (typeof opt === 'object' ? opt.value : opt) === value)
            if (currentOption) {
                setSelectedValue(typeof currentOption === 'object' ? currentOption.label : currentOption)
            }
        } else {
            setSelectedValue('')
        }
    }, [value, options])

    const handleClick = () => {
        setOpen(!open)
    }

    const handleSelect = (option) => {
        const val = typeof option === 'object' ? option.value : option
        const label = typeof option === 'object' ? option.label : option
        setSelectedValue(label)
        setSearchTerm('')
        setValue(name, val)
        setOpen(false)
    }

    const filteredOptions = options.filter(option => {
        const label = typeof option === 'object' ? option.label : option
        return label.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <div className="drop-down">
            <label htmlFor={name}>{placeholder}</label>
            <div className="select-input" onClick={handleClick}>
                {open ? (
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        style={{ border: 'none', outline: 'none', width: '100%', padding: 0, background: 'transparent' }}
                    />
                ) : (
                    <span>{selectedValue || placeholder}</span>
                )}
            </div>
            {open && (
                <div className="options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {
                        filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div key={index} className="option" onClick={() => handleSelect(option)}>
                                    {typeof option === 'object' ? option.label : option}
                                </div>
                            ))
                        ) : (
                            <div className="option" style={{ cursor: 'default', color: '#888' }}>No results found</div>
                        )
                    }
                </div>
            )}
            {error[name] &&
                <span className="error">{error[name].message}</span>}
        </div>
    )
}

export default Select
