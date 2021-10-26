import React, { useEffect, useState } from 'react'
import { Form, Select } from 'semantic-ui-react'
import axios from '../../axios'
import RenderCount from '../debug/RenderCount';

const SelectInput = ({
    input,
    label,
    width,
    options
}) => {
    const initialOptions = typeof options === 'string' ? [] : options;
    const [dropdownOptions, setDropdownOptions] = useState(initialOptions);

    useEffect(() => {
        if (typeof options === 'string') {
            const localStorageKey = input.name + 'DropdownOptions';
            const cachedOptions = localStorage.getItem(localStorageKey)
            if (!cachedOptions) {
                axios.get(options)
                    .then(response => {
                        console.log(response);
                        if (response && response.data) {
                            setDropdownOptions(response.data);
                            localStorage.setItem(localStorageKey, JSON.stringify(response.data));
                        }
                    })
                    .catch(error => console.log(error))
            } else {
                setDropdownOptions(JSON.parse(cachedOptions));
            }
        }
    }, [])

    return (
        <Form.Field width={width}>
            <RenderCount />
            <label>{label}</label>
            <Select
                value={input.value}
                onChange={(e, data) => input.onChange(data.value)}
                options={dropdownOptions}
            />
        </Form.Field>
    )
}

export default SelectInput