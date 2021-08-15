import React from 'react'
import { Form } from 'semantic-ui-react'

const TextInput = ({
    input: {type, ...input},
    label,
    width
}) => {
    return (
        <Form.Field width={width}>
            <label>{label}</label>
            <input {...input} type={type || "text"} />
        </Form.Field>
    )
}

export default TextInput