import React from 'react'
import { Form } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'

const DateInput = ({
    input,
    width,
    label,
    date,
    time,
}) => {
    return (
        <Form.Field width={width}>
            <label>{label}</label>
            <DateTimePicker
                value={input.value || null}
                onChange={input.onChange}
                onBlur={input.onBlur}
                onKeyDown={e => e.preventDefault}
                date={date}
                time={time}
            />
        </Form.Field>
    )
}

export default DateInput