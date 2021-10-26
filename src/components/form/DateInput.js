import React from 'react'
import { Form } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'
import RenderCount from '../debug/RenderCount'

const DateInput = ({
    input,
    width,
    label,
    date,
    time,
}) => {
    return (
        <Form.Field width={width}>
            <RenderCount />
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