import React, { Component } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { Button, Container, Form } from 'semantic-ui-react'
import TextInput from '../../components/form/TextInput';
import axios from '../../axios'
import { history } from '../..';

export default class LoginForm extends Component {
    handleSubmit = (values) => {
        console.log(values);
        axios.post('api/account/login', values)
            .then(response => {
                if (response && response.data && response.data.success) {
                    let returnUrl = '/';
                    if (this.props.location && this.props.location.returnUrl) {
                        returnUrl = this.props.location.returnUrl;
                    }

                    window.localStorage.setItem('jwt', response.data.token);

                    history.push(returnUrl);
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <Container>
                <FinalForm
                    onSubmit={this.handleSubmit}
                    render={({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Field
                                name="username"
                                label="Tên đăng nhập"
                                width={6}
                                component={TextInput}
                            />
                            <Field
                                name="password"
                                type="password"
                                label="Mật khẩu"
                                width={6}
                                component={TextInput}
                            />
                            <Button type="submit" content="Đăng nhập" />
                        </Form>
                    )}
                />   
            </Container>
        )
    }
}
