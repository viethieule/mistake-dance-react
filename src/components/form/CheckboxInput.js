import React from 'react'
import { Checkbox, Form } from 'semantic-ui-react'
import RenderCount from '../debug/RenderCount';

const CheckboxInput = (props) => {
    const {
        input: { value, ...input },
        type,
        ...rest
    } = props;
    return (
        <Form.Field width={props.width}>
            <RenderCount />
            <Checkbox
                {...input}
                {...rest}
                value={value}
                label={props.label}
                onChange={(evt, data) => {
                    input.onChange({ target: { type: "checkbox", value, checked: data.checked } })
                }}
            />
        </Form.Field>
    )
}

export default CheckboxInput