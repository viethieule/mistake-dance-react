import React from 'react'
import TimePicker from 'react-time-picker'
import { Form } from 'semantic-ui-react'
import './TimeInput.css'

const TimeInput = ({
    input,
    label,
    width
}) => {
    return (
        <Form.Field width={width}>
            <label>{label}</label>
            <TimePicker
                name={input.name}
                value={input.value}
                onChange={input.onChange}
                format="h:mm a"
                disableClock={true}
            />
        </Form.Field>
    )
}

export default TimeInput